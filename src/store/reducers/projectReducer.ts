import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {LoadingState, ProjectInfoCreate, ProjectInfoRead} from "../../server/interfaces";
import {countProjects, apiCreateProject, listProjects} from "../../server/api";
import {IRootState} from "../store";

export const createProject = createAsyncThunk(
    'projects/create',
    async (pic: ProjectInfoCreate, {rejectWithValue, getState}) => {
        let state = getState() as IRootState;
        let token = state.accountSlice.token;
        const response = await apiCreateProject(token, pic)
        if (response.status === 200) {
            return response.data
        }
        return rejectWithValue(response.data)
    }
)

export const loadProjects = createAsyncThunk<ProjectInfoRead[], void>(
    'projects/list',
    async (req, {rejectWithValue, getState}) => {
        let state = getState() as IRootState;
        let token = state.accountSlice.token;
        let limit = state.projectSlice.limit;
        let page = state.projectSlice.page;
        const response = await listProjects(token, {
            limit: limit,
            offset: (page - 1) * limit
        })
        if (response.status === 200) {
            return response.data
        }
        return rejectWithValue(response.data)
    }
)

export const countProjectsInBusinessAccount = createAsyncThunk<number, void>(
    'projects/count',
    async (_, {getState, rejectWithValue}) => {
        let state = getState() as IRootState;
        let token = state.accountSlice.token;
        const response = await countProjects(token)
        if (response.status === 200) {
            return response.data
        }
        return rejectWithValue(response.status)
    }
)

interface SliceState {
    limit: number
    page: number
    projects?: ProjectInfoRead[]
    errorLoadingProject?: any
    loadingState?: LoadingState
    totalCount?: number
    totalCountLoadingState?: LoadingState
    errorLoadingTotalCount?: any
    creatingProject: boolean
    projectCreatingState?: LoadingState
    projectCreatingError?: any
}

const initialState: SliceState = {
    limit: 10,
    page: 1,
    creatingProject: false
}

const slice = createSlice(
    {
        name: "projectSlice",
        initialState: initialState,
        reducers: {
            reset: (state) => {
                state.loadingState = undefined
                state.projects = undefined
                state.errorLoadingProject = undefined
            },
            resetCountLoading: (state) => {
                state.errorLoadingTotalCount = undefined
                state.totalCount = undefined
                state.totalCountLoadingState = undefined
            },
            setLimit: (state, action: PayloadAction<number>) => {
                state.limit = action.payload
            },
            setPage: (state, action: PayloadAction<number>) => {
                state.page = action.payload
            },
            isCreatingProject: (state, action: PayloadAction<boolean>) => {
                state.creatingProject = action.payload
            },
            resetCreatingProject: (state) => {
                state.creatingProject = false
                state.projectCreatingState = undefined
                state.projectCreatingError = undefined
            }
        },
        extraReducers: (builder) => {
            builder.addCase(
                loadProjects.pending,
                (state) => {
                    state.loadingState = 'PENDING'
                }
            )
            builder.addCase(
                loadProjects.rejected,
                (state, payload) => {
                    state.loadingState = 'ERRORED'
                    state.errorLoadingProject = payload.payload
                }
            )
            builder.addCase(
                loadProjects.fulfilled,
                (state, {payload}) => {
                    state.loadingState = 'DONE'
                    state.errorLoadingProject = undefined
                    state.projects = payload
                }
            )
            builder.addCase(
                countProjectsInBusinessAccount.pending,
                (state) => {
                    state.totalCountLoadingState = 'PENDING'
                }
            )
            builder.addCase(
                countProjectsInBusinessAccount.rejected,
                (state, {payload}) => {
                    state.errorLoadingTotalCount = payload
                    state.totalCountLoadingState = 'ERRORED'
                    state.totalCount = undefined
                }
            )
            builder.addCase(
                countProjectsInBusinessAccount.fulfilled,
                (state, {payload}) => {
                    state.errorLoadingTotalCount = undefined
                    state.totalCountLoadingState = 'DONE'
                    state.totalCount = payload
                }
            )

            builder.addCase(
                createProject.pending,
                (state) => {
                    state.projectCreatingState = 'PENDING'
                }
            )

            builder.addCase(
                createProject.fulfilled,
                (state) => {
                    state.projectCreatingState = 'DONE'
                    state.projectCreatingError = undefined
                }
            )

            builder.addCase(
                createProject.rejected,
                (state, action) => {
                    state.projectCreatingState = 'ERRORED'
                    state.projectCreatingError = action.payload
                }
            )
        }
    }
)

const {actions, reducer} = slice;

export const {reset, resetCountLoading, setLimit, setPage, isCreatingProject, resetCreatingProject} = actions;

export default reducer;