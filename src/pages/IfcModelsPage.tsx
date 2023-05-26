import React from "react";
import {IRootState} from "../store/store";
import {connect, ConnectedProps} from "react-redux";
import {Grid} from "@mui/material";
import IfcModelsGridComponent from "./components/IfcModelsGridComponent";


interface IProps extends ReduxProps {
}

interface IState {
}


class ProjectsPage extends React.Component<IProps, IState> {
    render() {
        return (
            <Grid padding={2} bgcolor={"#FFFFFF"}>
                <IfcModelsGridComponent/>
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