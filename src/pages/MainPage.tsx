import React from "react";
import {Grid, Paper} from "@mui/material";
import {IRootState} from "../store/store";
import {connect} from "react-redux";
import {ConnectedProps} from "react-redux/es/exports";
import AccountInfoComponent from "./components/AccountInfoComponent";
import {resetAccountInfo} from "../store/reducers/accountReducer";

import './MainPage.css';


interface IProps extends ReduxProps {
}

interface IState {
}

class MainWindow extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        window.addEventListener("unload", this.reset)
    }

    reset = () => {
        this.props.resetAccountInfo()
        window.removeEventListener("unload", this.reset)
    }

    componentWillUnmount() {
        this.reset()
    }

    render() {
        return (
            <Grid container marginTop={0}
                  direction="row">
                <Grid item marginLeft={2} marginTop={2}>
                    <Paper elevation={5}>
                        <AccountInfoComponent/>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state: IRootState) => (
    {}
)

const mapDispatchToProps = {resetAccountInfo}

const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(MainWindow);