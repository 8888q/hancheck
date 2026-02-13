/** @jsxImportSource @emotion/react */
import { BugReport, CalendarMonth, FitnessCenter } from "@mui/icons-material";
import { Button, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Difficulty } from "../lib/enums";
import { useHeaderData } from "./Page";
import { DIFFICULTY_NAMES } from "../lib/constants";
import { capitalizeFirstLetter } from "../lib/utils";
import { getSeed } from "./Daily";
import seedrandom from "seedrandom";

export function Homepage() {
    const { title, setTitle } = useHeaderData();
    const navigate = useNavigate();
    const [difficulty, setDifficulty] = useState(Difficulty.Easy);
    const [debugOpen, setDebugOpen] = useState(false);

    const now_num = useMemo(() => {
        return new Date().getTime();
    }, []);
    const seed = useMemo(() => {
        return getSeed();
    }, []);
    const first_five_random_output = useMemo(() => {
        const random = seedrandom(seed.toString());
        return [random(), random(), random(), random(), random()];
    }, [seed]);


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
                navigate(`/practice/${DIFFICULTY_NAMES[difficulty]}`);
            }}
                // disabled={true}
                endIcon={<FitnessCenter />}
            >
                practice
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
                    <FormControlLabel value={Difficulty.Easy} control={<Radio />} label={capitalizeFirstLetter(DIFFICULTY_NAMES[Difficulty.Easy])} />
                    <FormControlLabel value={Difficulty.Medium} control={<Radio />} label={capitalizeFirstLetter(DIFFICULTY_NAMES[Difficulty.Medium])} />
                    <FormControlLabel value={Difficulty.Hard} control={<Radio />} label={capitalizeFirstLetter(DIFFICULTY_NAMES[Difficulty.Hard])} />
                </RadioGroup>
            </FormControl>
            {
                debugOpen &&
                <div>
                    <p>Debug</p>
                    <p>
                        now_num: {now_num}
                        <br />
                        seed: {seed}
                        <br />
                        first_five_random_output: {first_five_random_output.join(", ")}
                    </p>
                </div>
            }
            <IconButton onClick={() => setDebugOpen(!debugOpen)} sx={{
                marginLeft: "auto",
                marginTop: "auto",
            }}>
                <BugReport />
            </IconButton>
        </div>
    )
}