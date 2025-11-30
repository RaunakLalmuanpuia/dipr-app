import { Outlet } from "react-router-dom"
import AppAppBar from "../components/AppAppBar.jsx";
import Footer from "../components/Footer";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import React from "react";

const AuthLayout = () => {
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
                    my: 5,
                    gap: 4,
                }}
            >
                {/* Pages will appear here */}
                <main className="App">
                    <Outlet />
                </main>
            </Container>


            <Footer />

        </>
    );
};

export default AuthLayout;
