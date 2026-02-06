/** @jsxImportSource @emotion/react */
import { Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import { useNavigate } from "react-router";
import { useState } from "react";
import { CalendarMonth, FitnessCenter } from "@mui/icons-material";
import { Difficulty } from "../lib/enums";

export function Homepage() {
    const navigate = useNavigate();
    const [difficulty, setDifficulty] = useState(Difficulty.Easy);

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
        }}
        >
            <h1>HanCheck</h1>
            <Button variant="contained" color="primary" onClick={() => {
                navigate("/daily");
            }}>
                play the daily
                <CalendarMonth />
            </Button>
            <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Difficulty</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
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
            <Button variant="contained" color="primary" onClick={() => {
                navigate("/practice");
            }}
            disabled={true}
            >
                practice
                <FitnessCenter />
                (Coming Soon)
            </Button>
        </div>
    )
}