import React from "react";
import {createBrowserRouter} from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import {UnexpectedErrorPage} from "../pages/ErrorPage";
import MainWindow from "../pages/MainPage";
import RegisterPage from "../pages/RegisterPage";
import ProjectsPage from "../pages/ProjectsPage";
import PlyPage from "../pages/PlyPage";
import IfcModelsPage from "../pages/IfcModelsPage";
import IfcViewer from "../pages/components/IfcViewer";

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
                path: '/models/:model_id',
                element: <IfcViewer/>
            },
            {
                path: '/models',
                element: <IfcModelsPage/>,
            },
            {
                path: '/stages',
                element: <div>Stages</div>
            },
            {
                path: '/ply/creator',
                element: <PlyPage/>
            }
        ]
    },
])