import React from "react";
import {Grid, Stack, Typography} from "@mui/material";
import {AddHomeWork} from "@mui/icons-material";
import {Column} from "react-data-grid";
import moment from "moment";
import {connect, ConnectedProps} from "react-redux";
import {IRootState} from "../../store/store";

interface IProps extends ReduxProps {

}

interface IState {
}

const mapStateToProps = (state: IRootState) => {
    return {}
}

const mapDispatchToProps = {}

const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>

const NoData = () => (
    <div style={{
        textAlign: 'center',
        gridColumn: '1/-1',
        minHeight: "400px",
        minWidth: "100%",
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <Stack direction="column" fontSize={30} alignItems={"center"} gap={1}>
            <AddHomeWork color={"primary"} style={{fontSize: 50}} fontSize={"inherit"}/>
            <Typography color={"text.primary"}>Здесь пока нет проектов.<br/>Поспешите
                создать первый!</Typography>
        </Stack>
    </div>
)

const columns: Column<any>[] = [
    {
        key: 'project_name',
        editable: false,
        headerRenderer: (props) => {
            return (<Grid className="header-cell" item container bgcolor={"inherit"} alignItems="center"><Typography
                textAlign="center">Наименование
                проекта</Typography></Grid>)
        },
        formatter: (props) => {
            const name = props.row[props.column.key]
            return (<Grid height={"100%"} item container alignItems="center"><Typography>{name}</Typography></Grid>)
        },
        name: 'Наименование проекта'
    },
    {
        key: 'stars',
        name: 'Звёзд',
        width: 100,
        headerRenderer: (props) => {
            return (
                <Grid className="header-cell" item container bgcolor={"inherit"}
                      alignItems="center"><Typography>Звёзд</Typography></Grid>)
        },
        formatter: (props) => {
            const stars = props.row[props.column.key]
            return (<Grid className="data-cell" item container alignItems="center"><Typography
                color={"text.secondary"}>{stars}</Typography></Grid>)
        }
    },
    {
        key: 'created_at',
        name: 'Создан',
        width: 270,
        headerRenderer: (props) => {
            return (
                <Grid className="header-cell" item container bgcolor={"inherit"}
                      alignItems="center"><Typography>Создан</Typography></Grid>)
        },
        formatter: (props) => {
            const secs = props.row[props.column.key].secs_since_epoch
            return (<Grid className="data-cell text-align-right" item container alignItems="center"><Typography
                color={"text.secondary"}>{moment.unix(secs).format("LLL")}</Typography></Grid>)
        }
    }
];