/** @jsxImportSource @emotion/react */

import { useNavigate, useParams } from "react-router";
import { Difficulty } from "../lib/enums";

export function Practice() {
    const { difficultyParam } = useParams();
    const navigate = useNavigate();
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
    return (
        <div>
            <h1>Practice</h1>
        </div>
    );
}