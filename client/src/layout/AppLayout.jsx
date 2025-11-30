import { Outlet } from "react-router-dom"
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

import React from "react";

const AppLayout = () => {
    return (
        <>
            <CssBaseline enableColorScheme />

            <Container
                maxWidth="lg"
                component="main"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    my: 5,
                    gap: 4,
                }}
            >
                {/* Pages will appear here */}
                <main className="App">
                    <Outlet />
                </main>
            </Container>


        </>
    )
}

export default AppLayout
