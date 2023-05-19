import React, {useState} from 'react';
import {createTheme, PaletteColorOptions, responsiveFontSizes, ThemeProvider} from "@mui/material";
import {Provider} from 'react-redux';
import {RouterProvider} from "react-router-dom";
import store from "./store/store";
import {router} from "./router/router";
import {UnexpectedErrorPage} from "./pages/ErrorPage";
import './App.css'
import colors from './colors';
import Toolbar from "./pages/components/ActionToolbar";

declare module '@mui/material/styles' {
    interface PaletteOptions {
        contrast?: PaletteColorOptions;
    }
}

const darkTheme = responsiveFontSizes(createTheme({
    palette: {
        mode: 'dark',
        text: {
            primary: colors.dark.textPrimary,
        },
        primary: {
            main: "#C40A3C",
            light: "#E9587F",
            dark: "#7A0021"
        },
        info: {
            main: "#08925E",
            light: "#43B288",
            dark: "#005B39"
        },
    }
}));

const lightTheme = responsiveFontSizes(createTheme({
    palette: {
        mode: 'light',
        text: {
            primary: "#000000FF",
            secondary: "#00000099",
            disabled: "#00000033",
        },
        contrast: {
            main: "#FFFFFF"
        },
        primary: {
            main: "#C40A3C",
            light: "#E9587F",
            dark: "#7A0021"
        },
        info: {
            main: "#08925E",
            light: "#43B288",
            dark: "#005B39"
        },
    },
    typography: {
        fontFamily: "'Montserrat', sans-serif"
    }
}));

const App = () => {
    const [isDark, useDark] = useState(false)
    return (
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
            <Provider store={store}>
                <RouterProvider fallbackElement={<UnexpectedErrorPage/>} router={router}/>
            </Provider>
        </ThemeProvider>
    );
}

export default App;
