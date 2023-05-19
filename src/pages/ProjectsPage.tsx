import React from "react";
import {IRootState} from "../store/store";
import {connect, ConnectedProps} from "react-redux";
import ProjectsGridComponent from "./components/ProjectsGridComponent";
import {Grid, Paper} from "@mui/material";


interface IProps extends ReduxProps {
}

interface IState {
}


class ProjectsPage extends React.Component<IProps, IState> {
    render() {
        return (
            <Grid padding={2} bgcolor={"#FFFFFF"}>
                <Paper elevation={5}>
                    <ProjectsGridComponent/>
                </Paper>
            </Grid>
        )
    }
}

const mapStateToProps = (state: IRootState) => {
    return {}
}

const mapDispatchToProps = {}

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>

export default connector(ProjectsPage)