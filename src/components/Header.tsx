/** @jsxImportSource @emotion/react */

import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useHeaderData } from "./Page";

export function Header() {
    const { title } = useHeaderData();
    const currentPath = useLocation().pathname;
    const navigate = useNavigate();

    return (
        <div
            css={{
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <h2>
                认字戏
            </h2>
            <div css={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                // border: "1px solid red",
                padding: "10px",
            }}>
                {
                    currentPath !== "/" ? (
                        <Button onClick={() => {
                            navigate(-1);
                        }}>
                            <ArrowBack />
                        </Button>
                    ) : null
                }
                <h1>{title}</h1>
                {
                    currentPath !== "/" ? (
                        <div
                            css={{
                                width: "2em"
                            }}
                        />
                    ) : null
                }
            </div>
        </div>
    );
}