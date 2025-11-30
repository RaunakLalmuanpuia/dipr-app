// Layout.jsx
import React from "react";

import AppAppBar from "../components/AppAppBar";
import Footer from "../components/Footer";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

export default function Layout({children}) {
    return (
        <>
            <CssBaseline enableColorScheme />

            <AppAppBar />

            <Container
                maxWidth="lg"
                component="main"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    my: 16,
                    gap: 4,
                }}
            >
                {/* Pages will appear here */}
                {children}
            </Container>

            <Footer />
        </>
    );
}
