/** @jsxImportSource @emotion/react */
import { Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { CalendarMonth, FitnessCenter } from "@mui/icons-material";
import { Difficulty } from "../lib/enums";
import { useHeaderData } from "./Page";

export function Homepage() {
    const { title, setTitle } = useHeaderData();
    const navigate = useNavigate();
    const [difficulty, setDifficulty] = useState(Difficulty.Easy);

    useEffect(() => {
        setTitle("HanCheck");
    }, [title,]);

    return (
        <div
            css={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
                gap: "10px",
            }}
        >
            <Button endIcon={<CalendarMonth />} variant="contained" color="primary" onClick={() => {
                navigate("/daily");
            }}>
                play the daily
            </Button>
            <br />
            <Button variant="contained" color="primary" onClick={() => {
                navigate("/practice");
            }}
                disabled={true}
                endIcon={<FitnessCenter />}
            >
                practice
                (Coming Soon)
            </Button>
            <FormControl>
                <FormLabel id="difficulty-label">Difficulty</FormLabel>
                <RadioGroup
                    row
                    defaultValue={Difficulty.Easy}
                    name="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as unknown as Difficulty)}
                >
                    <FormControlLabel value={Difficulty.Easy} control={<Radio />} label="Easy" />
                    <FormControlLabel value={Difficulty.Medium} control={<Radio />} label="Medium" />
                    <FormControlLabel value={Difficulty.Hard} control={<Radio />} label="Hard" />
                </RadioGroup>
            </FormControl>
        </div>
    )
}