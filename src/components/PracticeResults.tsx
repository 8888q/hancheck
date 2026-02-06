/** @jsxImportSource @emotion/react */
import { ArrowForward } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import type { HSKWord } from "../lib/interfaces";
import type { Difficulty } from "../lib/enums";
import { DIFFICULTY_NAMES } from "../lib/constants";
import { capitalizeFirstLetter, evaluateAnswer } from "../lib/utils";
import type { Interpolation, Theme } from "@emotion/react";

interface PracticeResultsProps {
    answers: string[];
    practiceWords: HSKWord[];
    difficulty: Difficulty;
    incorrectAnswerCount: number;
}

const rowHeaderStyle: Interpolation<Theme> = {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
};

export function PracticeResults({ answers, practiceWords, difficulty, incorrectAnswerCount }: PracticeResultsProps) {
    const navigate = useNavigate();
    const numCols = 5;

    return (
        <div
            css={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
                gap: "10px",
            }}>
                <h2>
                    You spelled {answers.length - incorrectAnswerCount} {DIFFICULTY_NAMES[difficulty]} words correctly.
                </h2>
            <Button onClick={() => {
                navigate("/");
            }}
                variant="contained"
                color="primary"
                endIcon={<ArrowForward />}
            >
                Play Again
            </Button>
            <br />
            <table>
                <tbody>
                    <tr>
                        <td colSpan={numCols} css={rowHeaderStyle}>
                            {capitalizeFirstLetter(DIFFICULTY_NAMES[difficulty])} Words
                        </td>
                    </tr>
                    {
                        answers.map((answer, index) => {
                            return <tr>
                                <td>{practiceWords[index].simplified}</td>
                                <td>{practiceWords[index].pinyin_diacritics}</td>
                                <td>{practiceWords[index].definition}</td>
                                <td
                                    css={{
                                        width: "2em"
                                    }}
                                />
                                <td
                                    css={!evaluateAnswer(answer, practiceWords[index]) ? {
                                        textDecorationLine: "underline",
                                        textDecorationStyle: "wavy",
                                        textDecorationColor: "red",
                                    } : {}}
                                >{answer}</td >
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}