/** @jsxImportSource @emotion/react */
import type { Interpolation, Theme } from "@emotion/react";
import { Difficulty } from "../lib/enums";
import type { HSKWord } from "../lib/interfaces";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useHeaderData } from "./Page";
import { ArrowForward, ContentCopy } from "@mui/icons-material";

interface DailyResultsProps {
    allAnswers: string[][];
    easyWords: HSKWord[];
    mediumWords: HSKWord[];
    hardWords: HSKWord[];
    seed: number;
}

const rowHeaderStyle: Interpolation<Theme> = {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
};

export function DailyResults({ allAnswers, easyWords, mediumWords, hardWords, seed }: DailyResultsProps) {
    const navigate = useNavigate();
    const numCols = 5;
    const easyScore = allAnswers[Difficulty.Easy].map((answer, index) => {
        return answer === easyWords[index].pinyin_toneless;
    });
    const easyScoreString = easyScore.map((score) => score ? "🟩" : "🟥").join("");
    const mediumScore = allAnswers[Difficulty.Medium].map((answer, index) => {
        return answer === mediumWords[index].pinyin_toneless;
    });
    const mediumScoreString = mediumScore.map((score) => score ? "🟩" : "🟥").join("");
    const hardScore = allAnswers[Difficulty.Hard].map((answer, index) => {
        return answer === hardWords[index].pinyin_toneless;
    });
    const hardScoreString = hardScore.map((score) => score ? "🟩" : "🟥").join("");

    function copyResults() {
        navigator.clipboard.writeText(
            `Hancheck #${seed - 20489}` + "\n" + easyScoreString + "\n" +
            mediumScoreString + "\n" + hardScoreString + "\n\n" + "https://8888q.github.io/hancheck/"
        );
    }

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
            <p
                css={{
                    fontSize: "32px",
                }}
            >
                {
                    easyScoreString
                }
                <br />
                {
                    mediumScoreString
                }
                <br />
                {
                    hardScoreString
                }
            </p>
            <Button
                startIcon={<ContentCopy />}
                onClick={() => {
                    copyResults();
                }}
                variant="contained"
                color="primary"
            >
                Copy Results
            </Button>
            <br />
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
                            Easy Words
                        </td>
                    </tr>
                    {
                        easyWords.map((word, index) => {
                            return <tr>
                                <td>{word.simplified}</td>
                                <td>{word.pinyin_diacritics}</td>
                                <td>{word.definition}</td>
                                <td
                                    css={{
                                        width: "2em"
                                    }}
                                />
                                <td
                                    css={!easyScore[index] ? {
                                        textDecorationLine: "underline",
                                        textDecorationStyle: "wavy",
                                        textDecorationColor: "red",
                                    } : {}}
                                >{allAnswers[Difficulty.Easy][index]}</td >
                            </tr>
                        })
                    }
                    <tr>
                        <td colSpan={numCols} css={rowHeaderStyle}>Medium Words</td>
                    </tr>
                    {
                        mediumWords.map((word, index) => {
                            return <tr>
                                <td>{word.simplified}</td>
                                <td>{word.pinyin_diacritics}</td>
                                <td>{word.definition}</td>
                                <td />
                                <td
                                    css={!mediumScore[index] ? {
                                        textDecorationLine: "underline",
                                        textDecorationStyle: "wavy",
                                        textDecorationColor: "red",
                                    } : {}}
                                >{allAnswers[Difficulty.Medium][index]}</td >
                            </tr>
                        })
                    }
                    <tr>
                        <td colSpan={numCols} css={rowHeaderStyle}>Hard Words</td>
                    </tr>
                    {
                        hardWords.map((word, index) => {
                            return <tr>
                                <td>{word.simplified}</td>
                                <td>{word.pinyin_diacritics}</td>
                                <td>{word.definition}</td>
                                <td />
                                <td
                                    css={!hardScore[index] ? {
                                        textDecorationLine: "underline",
                                        textDecorationStyle: "wavy",
                                        textDecorationColor: "red",
                                    } : {}}
                                >{allAnswers[Difficulty.Hard][index]}</td >
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div >
    )
}