import React from "react";
import {createBrowserRouter} from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import {UnexpectedErrorPage} from "../pages/ErrorPage";
import MainWindow from "../pages/MainPage";
import RegisterPage from "../pages/RegisterPage";
import ProjectsPage from "../pages/ProjectsPage";

export const router = createBrowserRouter([
    {
        path: '/register',
        element: <RegisterPage/>
    },
    {
        path: "/",
        element: <AuthPage/>,
        errorElement: <UnexpectedErrorPage/>,
        children: [
            {
                path: "/",
                element: <MainWindow/>,
            },
            {
                path: "/projects",
                element: <ProjectsPage/>
            },
            {
                path: '/models',
                element: <div>IfcModels</div>
            },
            {
                path: '/stages',
                element: <div>Stages</div>
            }
        ]
    },
])