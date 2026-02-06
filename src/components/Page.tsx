/** @jsxImportSource @emotion/react */
import { createContext, useContext, useState } from "react";
import { Outlet } from "react-router";
import { Header } from "./Header";

interface HeaderData {
    title: string;
    setTitle: (title: string) => void;
}

const HeaderContext = createContext<HeaderData>({
    title: "HanCheck",
    setTitle: () => {},
});

export function useHeaderData() {
    return useContext(HeaderContext);
}

export function Page() {
    const [title, setTitle] = useState<string>("HanCheck");
    return (
        <>
            <HeaderContext.Provider value={{
                title: title,
                setTitle: setTitle,
            }}>
                <div css={{
                    height: "100vh",
                    width: "100vw",
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    // backgroundColor: "theme.page",
                }}>
                    <Header />
                    <Outlet />
                </div>
            </HeaderContext.Provider>
        </>
    );
}