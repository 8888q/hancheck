/** @jsxImportSource @emotion/react */
import { useMemo, useRef, useState } from "react";
import type { HSKWord } from "../lib/interfaces";
import hsk_dict from "../lib/data.json";
import seedrandom from "seedrandom";
import { Difficulty } from "../lib/enums";
import { Button, IconButton, TextField } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { DailyResults } from "./DailyResults";

function getSeed(): number {
    const now_num = (new Date()).getTime();
    const day_num = Math.floor(now_num / (1000 * 60 * 60 * 24));
    return day_num;
}

function getFiveRandomWords(arr: HSKWord[], seed: number): HSKWord[] {
    const random = seedrandom(seed.toString());
    const shuffled = arr.sort(() => random() - 0.5);
    return shuffled.slice(0, 5);
}

function getEasyWords(seed: number): HSKWord[] {
    const hsk1: HSKWord[] = hsk_dict["hsk1"];
    const hsk2: HSKWord[] = hsk_dict["hsk2"];
    const combined = [...hsk1, ...hsk2];
    return getFiveRandomWords(combined, seed);
}

function getMediumWords(seed: number): HSKWord[] {
    const hsk3: HSKWord[] = hsk_dict["hsk3"];
    const hsk4: HSKWord[] = hsk_dict["hsk4"];
    const combined = [...hsk3, ...hsk4];
    return getFiveRandomWords(combined, seed);
}

function getHardWords(seed: number): HSKWord[] {
    const hsk5: HSKWord[] = hsk_dict["hsk5"];
    const hsk6: HSKWord[] = hsk_dict["hsk6"];
    const combined = [...hsk5, ...hsk6];
    return getFiveRandomWords(combined, seed);
}

enum DailyState {
    Playing = 0,
    Results = 1,
}

export function Daily() {
    const seed = useMemo(() => {
        return getSeed();
    }, []);

    const easyWords = useMemo(() => {
        return getEasyWords(seed);
    }, [seed]);

    const mediumWords = useMemo(() => {
        return getMediumWords(seed);
    }, [seed]);

    const hardWords = useMemo(() => {
        return getHardWords(seed);
    }, [seed]);

    const [difficulty, setDifficulty] = useState(Difficulty.Easy);
    const [state, setState] = useState(DailyState.Playing);
    const [currentWords, setCurrentWords] = useState<HSKWord[]>(easyWords);
    const [selectedWord, setSelectedWord] = useState<HSKWord | null>(null);
    const [answerField, setAnswerField] = useState<string>("");
    const [roundAnswers, setRoundAnswers] = useState<(boolean | null)[]>([null, null, null, null, null]);
    const [allAnswers, setAllAnswers] = useState<string[][]>([["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]]);
    const answerFieldRef = useRef<HTMLInputElement>(null);

    const continueable = useMemo(() => {
        return roundAnswers.every(answer => answer !== null);
    }, [roundAnswers]);

    function handleAnswer(difficulty: Difficulty, index: number, answer: string) {
        if (!selectedWord) return;
        const newRoundAnswers = [...roundAnswers];
        newRoundAnswers[index] = answer === selectedWord.pinyin_toneless;
        const newAllAnswers = [...allAnswers];
        newAllAnswers[difficulty][index] = answer;
        setRoundAnswers(newRoundAnswers);
        setAllAnswers(newAllAnswers);
        setSelectedWord(null);
        setAnswerField("");
    }

    function handleContinue() {
        setSelectedWord(null);
        setAnswerField("");
        setRoundAnswers([null, null, null, null, null]);
        switch (difficulty) {
            case Difficulty.Easy:
                setCurrentWords(mediumWords);
                setDifficulty(Difficulty.Medium);
                break;
            case Difficulty.Medium:
                setCurrentWords(hardWords);
                setDifficulty(Difficulty.Hard);
                break;
            case Difficulty.Hard:
                setState(DailyState.Results);
                break;
        }
    }

    if (state === DailyState.Results) {
        return <DailyResults allAnswers={allAnswers} easyWords={easyWords} mediumWords={mediumWords} hardWords={hardWords} />
    }

    return (
        <div css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
            gap: "10px",
        }}>
            <h1>Daily</h1>
            <p
                css={{
                    fontSize: "60px",
                    fontWeight: "bold",
                }}
            >
                {selectedWord?.simplified ?? "?"}
            </p>
            <div css={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
            }}>
                {
                    currentWords.map((word, index) => {
                        return (
                            <IconButton
                                key={word.simplified}
                                sx={{
                                    border: "1px solid black",
                                    backgroundColor: (roundAnswers[index] === true ? "green" : (roundAnswers[index] === false ? "red" : "none")),
                                    cursor: (roundAnswers[index] !== null ? "default" : "pointer"),
                                    "&:hover": (roundAnswers[index] !== null ? {
                                        backgroundColor: (roundAnswers[index] === true ? "green" : (roundAnswers[index] === false ? "red" : "none")),
                                    } : {
                                        backgroundColor: "none",
                                    }),
                                }}
                                onClick={() => {
                                    if (roundAnswers[index] === null) {
                                        setSelectedWord(word);
                                        answerFieldRef.current?.focus();
                                    }
                                }}
                                disableRipple={roundAnswers[index] !== null}
                            >
                                <PlayArrow />
                            </IconButton>
                        )
                    })
                }
            </div>
            <TextField
                id="answer-field"
                label="Answer"
                inputRef={answerFieldRef}
                value={answerField}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setAnswerField(event.target.value);
                }}
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === "Enter") {
                        if (selectedWord) {
                            handleAnswer(difficulty, currentWords.indexOf(selectedWord), answerField);
                        }
                    }
                }}
                disabled={continueable}
            />
            {
                continueable &&
                <Button
                    onClick={() => {
                        handleContinue();
                    }}
                >
                    Continue
                </Button>
            }
        </div>
    )
}