import React from "react";
import {IRootState} from "../../store/store";
import {connect, ConnectedProps} from "react-redux";
import {
    Box,
    Button,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Stack,
    Typography
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import 'react-data-grid/lib/styles.css';
import './Projects.css'
import {
    countProjectsInBusinessAccount,
    isCreatingProject,
    loadProjects,
    reset,
    resetCountLoading,
    setLimit,
    setPage
} from "../../store/reducers/projectReducer";
import moment from "moment";
import {AddBox, AddHomeWork} from "@mui/icons-material";
import ProjectCreateModal from "./ProjectCreateModal";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {ProjectInfoRead} from "../../server/interfaces";

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

const columns: GridColDef<ProjectInfoRead>[] = [
    {
        field: 'project_name',
        editable: false,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        flex: 1,
        renderHeader: (props) => {
            return (<Grid className="header-cell" item container bgcolor={"inherit"} alignItems="center"><Typography
                textAlign="center">Наименование
                проекта</Typography></Grid>)
        },
        renderCell: (props) => {
            const name = props.value
            return (<Grid height={"100%"} item container flex={1}
                          alignItems="center"><Typography>{name}</Typography></Grid>)
        },
        headerName: 'Наименование проекта'
    },
    {
        field: 'stars',
        headerName: 'Звёзд',
        editable: false,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        headerAlign: 'center',
        renderHeader: (props) => {
            return (
                <Grid className="header-cell" item container bgcolor={"inherit"}
                      alignItems="center"><Typography>Звёзд</Typography></Grid>)
        },
        renderCell: (props) => {
            const stars = props.value
            return (<Grid className="data-cell" item container flex={1} justifyContent={"center"}
                          alignItems="center"><Typography
                color={"text.secondary"}>{stars}</Typography></Grid>)
        }
    },
    {
        field: 'created_at',
        headerName: 'Создан',
        disableColumnMenu: true,
        editable: false,
        sortable: false,
        minWidth: 200,
        filterable: false,
        headerAlign: 'center',
        renderCell: (props) => {
            const secs = props.value.secs_since_epoch
            return (<Grid className="data-cell text-align-right" justifyContent={"center"} item container
                          alignItems="center"><Typography
                color={"text.secondary"}>{moment.unix(secs).format("LLL")}</Typography></Grid>)
        }
    }
];

interface IProps extends ReduxProps {

}

interface IState {
}


class ProjectsGridComponent extends React.Component<IProps, IState> {
    constructor(props: Readonly<IProps> | IProps) {
        super(props);
        window.addEventListener("unload", this.reset)
    }

    componentDidMount() {
        this.props.loadProjects()
        this.props.countProjectsInBusinessAccount()
    }

    reset = () => {
        window.removeEventListener("unload", this.reset)
        this.props.reset()
        this.props.resetCountLoading()
    }

    componentWillUnmount() {
        this.reset()
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        const {limit, page} = this.props;
        const prevLimit = prevProps.limit;
        const prevPage = prevProps.page;
        if (limit !== prevLimit || page !== prevPage || (this.props.projectCreatingState !== prevProps.projectCreatingState && prevProps.projectCreatingState === 'PENDING')) {
            this.props.loadProjects()
        }
    }

    render() {
        const total_count = this.props.totalCount;
        const limit = this.props.limit;
        const page = this.props.page;
        if (total_count === undefined) {
            return <></>
        }
        const max_pages = total_count / limit;
        return (
            <>
                <ProjectCreateModal/>
                <Box component={"div"} padding={1.5}>
                    <Grid marginBottom={1} container flexWrap={"nowrap"} direction="row">
                        <Grid item>
                            <Stack marginBottom={2} direction="row" fontSize={30} alignItems={"center"} gap={1}>
                                <ApartmentIcon htmlColor="#a77444" style={{fontSize: 50}} fontSize={"inherit"}/>
                                Проекты
                            </Stack>
                        </Grid>
                        <Grid item container direction="row" justifyContent={"flex-end"} alignItems={"end"}>
                            <Grid item>
                                <Button onClick={() => this.props.isCreatingProject(true)} variant="outlined"
                                        color={"success"}
                                        endIcon={<AddBox color={"success"} style={{fontSize: 20}}
                                                         fontSize={"inherit"}/>}>
                                    Создать
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider/>
                    {
                        total_count > 0 ? (
                            <DataGrid pageSizeOptions={[]} hideFooterSelectedRowCount={true} disableRowSelectionOnClick
                                      sx={{marginTop: 2, marginBottom: 2}} localeText={
                                {
                                    MuiTablePagination: {
                                        nextIconButtonProps: {style: {display: "none"}},
                                        backIconButtonProps: {style: {display: "none"}},
                                        labelRowsPerPage: "Строк на странице",
                                        labelDisplayedRows: ({
                                                                 from,
                                                                 to
                                                             }) => from !== to ? `${from + (page - 1) * limit} - ${to + (page - 1) * limit} из ${total_count}` : `${from + (page - 1) * limit} из ${total_count}`
                                    },
                                    columnMenuHideColumn: "Скрыть",
                                    columnMenuManageColumns: "Управление отображаемыми колонками"
                                }
                            } getRowId={
                                (el => el.project_id)
                            } columns={columns} rows={this.props.projects || []}/>) : NoData()
                    }
                    <Grid marginBottom={2} container alignItems="center" direction={"row-reverse"}>
                        {total_count > 10 && (<Grid item>
                            <Pagination onChange={(e, page) => this.props.setPage(page)} page={this.props.page}
                                        count={Math.floor(max_pages) + 1} color="primary"/>
                        </Grid>)}
                        {max_pages > 1 && (<Grid item>
                            <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="select-per-page-label">На странице</InputLabel>
                                <Select
                                    labelId="select-per-page-label"
                                    id="select-per-page"
                                    value={limit}
                                    onChange={(e) => {
                                        const new_value = e.target.value as number
                                        this.props.setLimit(new_value)
                                    }}
                                    label="На странице"
                                >
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>)}
                    </Grid>
                </Box>
            </>
        )
    }
}


const mapStateToProps = (state: IRootState) => (
    {
        ...state.projectSlice
    }
)

const mapDispatchToProps = {
    reset,
    resetCountLoading,
    loadProjects,
    setLimit,
    setPage,
    countProjectsInBusinessAccount,
    isCreatingProject
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>

export default connector(ProjectsGridComponent)