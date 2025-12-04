import AppAppBar from "../components/AppAppBar.jsx";
import Footer from "../components/Footer";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from '@mui/material/Typography';
import React from "react";
import MainContent from "../components/home/MainContent";
import Latest from "../components/home/Latest";
const Home = () => {

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
                    <br/>
                   <MainContent/>
                <br/>
                    <Latest/>

            </Container>


            <Footer />


        </>
    )
}

export default Home
