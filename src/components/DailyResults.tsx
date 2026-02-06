/** @jsxImportSource @emotion/react */
import type { Interpolation, Theme } from "@emotion/react";
import { Difficulty } from "../lib/enums";
import type { HSKWord } from "../lib/interfaces";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";

interface DailyResultsProps {
    allAnswers: string[][];
    easyWords: HSKWord[];
    mediumWords: HSKWord[];
    hardWords: HSKWord[];
}

const rowHeaderStyle: Interpolation<Theme> = {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
};

export function DailyResults({ allAnswers, easyWords, mediumWords, hardWords }: DailyResultsProps) {
    const navigate = useNavigate();
    const easyScore = allAnswers[Difficulty.Easy].map((answer, index) => {
        return answer === easyWords[index].pinyin_toneless;
    });
    const mediumScore = allAnswers[Difficulty.Medium].map((answer, index) => {
        return answer === mediumWords[index].pinyin_toneless;
    });
    const hardScore = allAnswers[Difficulty.Hard].map((answer, index) => {
        return answer === hardWords[index].pinyin_toneless;
    });
    return (
        <div
            css={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "100vw",
                gap: "10px",
            }}>
            <h1>Results</h1>
            <p
                css={{
                    fontSize: "32px",
                }}
            >
                {
                    easyScore.map((score) => score ? "🟩" : "🟥").join("")
                }
                <br />
                {
                    mediumScore.map((score) => score ? "🟩" : "🟥").join("")
                }
                <br />
                {
                    hardScore.map((score) => score ? "🟩" : "🟥").join("")
                }
            </p>
            <Button onClick={() => {
                navigate("/");
            }}
            variant="contained"
            color="primary"
            >
                Play Again
            </Button>
            <table>
                <tbody>
                    <tr>
                        <td colSpan={5} css={rowHeaderStyle}>
                            Easy Words
                        </td>
                    </tr>
                    {
                        easyWords.map((word, index) => {
                            return <tr>
                                <td>{word.simplified}</td>
                                <td>{word.pinyin_num}</td>
                                <td>{word.pinyin_diacritics}</td>
                                <td>{word.definition}</td>
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
                        <td colSpan={5} css={rowHeaderStyle}>Medium Words</td>
                    </tr>
                    {
                        mediumWords.map((word, index) => {
                            return <tr>
                                <td>{word.simplified}</td>
                                <td>{word.pinyin_num}</td>
                                <td>{word.pinyin_diacritics}</td>
                                <td>{word.definition}</td>
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
                        <td colSpan={5} css={rowHeaderStyle}>Hard Words</td>
                    </tr>
                    {
                        hardWords.map((word, index) => {
                            return <tr>
                                <td>{word.simplified}</td>
                                <td>{word.pinyin_num}</td>
                                <td>{word.pinyin_diacritics}</td>
                                <td>{word.definition}</td>
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