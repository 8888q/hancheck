/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useRef, useState } from "react";
import type { HSKWord } from "../lib/interfaces";
import hsk_dict from "../lib/data.json";
import seedrandom from "seedrandom";
import { Difficulty } from "../lib/enums";
import { Button, IconButton, TextField } from "@mui/material";
import { ArrowForward, PlayArrow } from "@mui/icons-material";
import { DailyResults } from "./DailyResults";
import { useHeaderData } from "./Page";

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
    const [selectedWord, setSelectedWord] = useState<HSKWord | null>(easyWords[0]);
    const [answerField, setAnswerField] = useState<string>("");
    const [roundAnswers, setRoundAnswers] = useState<(boolean | null)[]>([null, null, null, null, null]);
    const [allAnswers, setAllAnswers] = useState<string[][]>([["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]]);
    const answerFieldRef = useRef<HTMLInputElement>(null);

    const { title, setTitle } = useHeaderData();
    useEffect(() => {
        if (state === DailyState.Playing) {
            setTitle("Daily");
        } else {
            setTitle("Results");
        }
    }, [title,state]);

    const continueable = useMemo(() => {
        return roundAnswers.every(answer => answer !== null);
    }, [roundAnswers]);

    function selectNextWord(prevIndex: number): number {
        let nextWordIndex = prevIndex + 1;
        while (nextWordIndex != prevIndex && roundAnswers[nextWordIndex] !== null) {
            nextWordIndex = (nextWordIndex + 1) % 5;
        }
        return nextWordIndex;
    }

    function handleAnswer(difficulty: Difficulty, index: number, answer: string) {
        if (!selectedWord) return;
        const newRoundAnswers = [...roundAnswers];
        newRoundAnswers[index] = answer === selectedWord.pinyin_toneless;
        const newAllAnswers = [...allAnswers];
        newAllAnswers[difficulty][index] = answer;
        setRoundAnswers(newRoundAnswers);
        setAllAnswers(newAllAnswers);
        if(!newRoundAnswers.every(answer => answer !== null)) {
            setSelectedWord(currentWords[selectNextWord(index)]);
        } else {
            setSelectedWord(null);
        }
        setAnswerField("");
    }

    function handleContinue() {
        setAnswerField("");
        setRoundAnswers([null, null, null, null, null]);
        switch (difficulty) {
            case Difficulty.Easy:
                setCurrentWords(mediumWords);
                setDifficulty(Difficulty.Medium);
                setSelectedWord(mediumWords[0]);
                break;
            case Difficulty.Medium:
                setCurrentWords(hardWords);
                setDifficulty(Difficulty.Hard);
                setSelectedWord(hardWords[0]);
                break;
            case Difficulty.Hard:
                setState(DailyState.Results);
                break;
        }
        setTimeout(() => {
            answerFieldRef.current?.focus();
        }, 100);
    }

    if (state === DailyState.Results) {
        return <DailyResults allAnswers={allAnswers} easyWords={easyWords} mediumWords={mediumWords} hardWords={hardWords} seed={seed} />
    }

    return (
        <div css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // justifyContent: "center",
            height: "100vh",
            width: "100vw",
            gap: "10px",
        }}>
            <p
                className="han-display"
                css={{
                    fontSize: "120px",
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
                        let backgroundColor = "none";
                        if (roundAnswers[index] === true) {
                            backgroundColor = "rgb(121, 177, 90)";
                        } else if (roundAnswers[index] === false) {
                            backgroundColor = "rgb(210, 88, 66)";
                        }
                        if (selectedWord === word) {
                            backgroundColor = "pink";
                        }
                        return (
                            <IconButton
                                key={word.simplified}
                                sx={{
                                    border: "1px solid black",
                                    backgroundColor: backgroundColor,
                                    cursor: (roundAnswers[index] !== null ? "default" : "pointer"),
                                    "&:hover": (roundAnswers[index] !== null ? {
                                        backgroundColor: (roundAnswers[index] === true ? "green" : (roundAnswers[index] === false ? "red" : "none")),
                                    } : {
                                        backgroundColor: "none",
                                    }),
                                    boxShadow: selectedWord === word ? "0 0 10px 0 rgba(0, 0, 0, 0.5)" : "none",
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
            <div
                css={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "4px",
                    alignItems: "center",
                }}
            >
                <TextField
                    id="answer-field"
                    label="Answer"
                    inputRef={answerFieldRef}
                    value={answerField}
                    onBeforeInput={(event: React.InputEvent<HTMLInputElement>) => {
                        if (event.data?.includes(" ")) {
                            event.preventDefault();
                            return;
                        }
                    }}
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
                <IconButton
                    onClick={() => {
                        if (selectedWord) {
                            handleAnswer(difficulty, currentWords.indexOf(selectedWord), answerField);
                        }
                    }}
                    disabled={!selectedWord}
                >
                    <ArrowForward />
                </IconButton>
            </div>
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