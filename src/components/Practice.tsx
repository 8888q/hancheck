/** @jsxImportSource @emotion/react */
import hsk_dict from "../lib/data.json";

import { useNavigate, useParams } from "react-router";
import { Difficulty, PlayingState } from "../lib/enums";
import type { HSKWord } from "../lib/interfaces";
import { useEffect, useMemo, useState } from "react";
import { useHeaderData } from "./Page";
import { Button, IconButton } from "@mui/material";
import { TextField } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { PracticeResults } from "./PracticeResults";
import { evaluateAnswer } from "../lib/utils";

function generatePracticeWords(difficulty: Difficulty): HSKWord[] {
    let wordList: HSKWord[] = [];
    switch (difficulty) {
        case Difficulty.Easy:
            const hsk1: HSKWord[] = hsk_dict["hsk1"];
            const hsk2: HSKWord[] = hsk_dict["hsk2"];
            wordList = [...hsk1, ...hsk2];
            break;
        case Difficulty.Medium:
            const hsk3: HSKWord[] = hsk_dict["hsk3"];
            const hsk4: HSKWord[] = hsk_dict["hsk4"];
            wordList = [...hsk3, ...hsk4];
            break;
        case Difficulty.Hard:
            const hsk5: HSKWord[] = hsk_dict["hsk5"];
            const hsk6: HSKWord[] = hsk_dict["hsk6"];
            wordList = [...hsk5, ...hsk6];
            break;
    }
    return wordList.sort(() => Math.random() - 0.5);
}

export function Practice() {
    const navigate = useNavigate();
    const { difficultyParam } = useParams();
    if (!difficultyParam || (difficultyParam !== "easy" && difficultyParam !== "medium" && difficultyParam !== "hard")) {
        navigate("/");
        return null;
    }
    let difficulty: Difficulty;
    switch (difficultyParam) {
        case "easy":
            difficulty = Difficulty.Easy;
            break;
        case "medium":
            difficulty = Difficulty.Medium;
            break;
        case "hard":
            difficulty = Difficulty.Hard;
            break;
        default:
            difficulty = Difficulty.Easy;
            break;
    }
    const practiceWords = useMemo(() => {
        return generatePracticeWords(difficulty);
    }, [difficulty]);

    const [currentWord, setCurrentWord] = useState<number>(0);
    const [answerField, setAnswerField] = useState<string>("");
    const [answers, setAnswers] = useState<string[]>([]);
    const [incorrectAnswerCount, setIncorrectAnswerCount] = useState<number>(0);
    const [state, setState] = useState(PlayingState.Playing);

    const { title, setTitle } = useHeaderData();
    useEffect(() => {
        if (state === PlayingState.Playing) {
            setTitle("Practice");
        } else {
            setTitle("Results");
        }
    }, [title, state]);

    function handleAnswer(answer: string) {
        if (answer.length === 0) {
            return;
        }
        setAnswers([...answers, answer]);
        setAnswerField("");
        if (!evaluateAnswer(answer, practiceWords[currentWord])) {
            setIncorrectAnswerCount(incorrectAnswerCount + 1);
        }
        setCurrentWord(currentWord + 1);
        if (currentWord === practiceWords.length - 1) {
            setState(PlayingState.Results);
        }
    }

    function handleContinue() {
        setAnswerField("");
        setState(PlayingState.Results);
    }

    if (state === PlayingState.Results) {
        return <PracticeResults answers={answers} practiceWords={practiceWords} difficulty={difficulty} incorrectAnswerCount={incorrectAnswerCount} />
    }

    return (
        <div css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            gap: "10px",
        }}>
            <div css={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                minWidth: "20vw",
            }}>
                <p
                    css={{
                        fontStyle: "italic",
                    }}
                >
                    Lives Remaining: {5 - incorrectAnswerCount}
                </p>
                <div css={{
                    flex: 1,
                }} />
                <p
                    css={{
                        fontStyle: "italic",
                    }}
                >
                    Score: {answers.length - incorrectAnswerCount}
                </p>
            </div>
            <p
                className="han-display"
                css={{
                    fontSize: "120px",
                }}
            >
                {incorrectAnswerCount < 5 ? practiceWords[currentWord].simplified : "🤦‍♂️"}
            </p>
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
                            handleAnswer(answerField);
                        }
                    }}
                    disabled={incorrectAnswerCount === 5}
                />
                <IconButton
                    onClick={() => {
                        handleAnswer(answerField);
                    }}
                    disabled={incorrectAnswerCount === 5}
                >
                    <ArrowForward />
                </IconButton>
            </div>
            <Button
                onClick={() => {
                    handleContinue();
                }}
            >
                Continue
            </Button>
        </div>
    );
}