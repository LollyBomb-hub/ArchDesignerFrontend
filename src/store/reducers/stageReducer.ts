import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    CompleteStageInfoRead,
    LoadingState,
    StageInfoCreate,
    StageInfoRead,
    StageToModelLinkInfoRead
} from "../../server/interfaces";
import {IRootState} from "../store";
import {assignModelToStage, createStage, listStages, readFullStageInfo} from "../../server/api";

interface SliceState {
    createStageState?: LoadingState
    createStageError?: any
    createdStage?: StageInfoRead
    listStagesState?: LoadingState
    listStagesError?: any
    listOfStages?: StageInfoRead[]
    assignModelToStageState?: LoadingState
    assignModelToStageError?: any
    assignModelToStageInfoRead?: StageToModelLinkInfoRead
    readFullStageInfoState?: LoadingState
    readFullStageInfoError?: any
    readFullStageInfo?: CompleteStageInfoRead
    currentPlyFile: string
}

export interface PlyVertex {
    x: number
    y: number
}

export interface PlyElement {
    x1: number
    x2: number
    x3: number
    x4: number
}

export const plyFileWithHeader = (vertexes: PlyVertex[], elements: PlyElement[]) => {
    const elementsLength = elements.length;
    const vertexCount = vertexes.length;
    const vertexesString = vertexes.map(
        el => {
            return `${el.x} ${el.y} 0`
        }
    ).join('\n');
    const elementsString = elements.map(
        el => {
            return `4 ${el.x1} ${el.x2} ${el.x3} ${el.x4}`
        }
    ).join('\n');
    return "ply\n" +
        "format ascii 1.0\n" +
        `element vertex ${vertexCount}\n` +
        "property float x\n" +
        "property float y\n" +
        "property float z\n" +
        `element face ${elementsLength}\n` +
        "property list uchar int vertex_index\n" +
        "end_header\n" +
        `${vertexesString}\n` +
        `${elementsString}`
}

const initialState: SliceState = {
    currentPlyFile: plyFileWithHeader([], [])
}

export const createStageThunk = createAsyncThunk(
    "stage/create",
    async (sic: StageInfoCreate, {rejectWithValue, getState}) => {
        const state = getState() as IRootState;
        const token = state.accountSlice.token
        const response = await createStage(token, sic);
        if (response.status === 200) {
            return response.data
        }
        return rejectWithValue(response.data)
    }
)

export const listStageThunk = createAsyncThunk(
    "stage/list",
    async ({limit, offset}: { limit?: number, offset?: number }, {rejectWithValue, getState}) => {
        const state = getState() as IRootState;
        const token = state.accountSlice.token;
        const response = await listStages(token, limit, offset)
        if (response.status === 200) {
            return response.data
        }
        return rejectWithValue(response.data)
    }
)

export const assignModelToStageThunk = createAsyncThunk(
    "stage/assign",
    async ({
               lic,
               stage_id,
               model_id
           }: { model_id: number, stage_id: number, lic: StageToModelLinkInfoRead }, {rejectWithValue, getState}) => {
        const state = getState() as IRootState;
        const token = state.accountSlice.token;
        const response = await assignModelToStage(
            token,
            stage_id,
            model_id,
            lic
        )
        if (response.status === 200) {
            return response.data
        }
        return rejectWithValue(response.data)
    }
)

export const readFullStageInfoThunk = createAsyncThunk(
    "stage/fullInfo",
    async (stage_id: number, {rejectWithValue, getState}) => {
        const state = getState() as IRootState;
        const token = state.accountSlice.token;
        const response = await readFullStageInfo(
            token,
            stage_id
        )
        if (response.status === 200) {
            return response.data
        }
        return rejectWithValue(response.data)
    }
)

const slice = createSlice(
    {
        name: "stageSlice",
        initialState: initialState,
        reducers: {
            resetCreating: (state) => {
                state.createStageState = undefined
                state.createdStage = undefined
                state.createStageError = undefined
            },
            resetList: (state) => {
                state.listStagesState = undefined
                state.listOfStages = undefined
                state.listStagesError = undefined
            },
            resetAssign: (state) => {
                state.assignModelToStageState = undefined
                state.assignModelToStageInfoRead = undefined
                state.assignModelToStageError = undefined
            },
            resetReadFull: (state) => {
                state.readFullStageInfoState = undefined
                state.readFullStageInfo = undefined
                state.readFullStageInfoError = undefined
            }
        },
        extraReducers: builder => {
            builder.addCase(
                createStageThunk.pending,
                (state) => {
                    state.createdStage = undefined
                    state.createStageError = undefined
                    state.createStageState = 'PENDING'
                }
            )
            builder.addCase(
                createStageThunk.fulfilled,
                (state, action) => {
                    state.createStageState = 'DONE'
                    state.createdStage = action.payload
                    state.createStageError = undefined
                }
            )
            builder.addCase(
                createStageThunk.rejected,
                (state, action) => {
                    state.createdStage = undefined
                    state.createStageError = action.payload
                    state.createStageState = 'ERRORED'
                }
            )
            builder.addCase(
                listStageThunk.pending,
                (state) => {
                    state.listStagesState = 'PENDING'
                    state.listOfStages = undefined
                    state.listStagesError = undefined
                }
            )
            builder.addCase(
                listStageThunk.fulfilled,
                (state, {payload}) => {
                    state.listStagesState = 'DONE'
                    state.listStagesError = undefined
                    state.listOfStages = payload
                }
            )
            builder.addCase(
                listStageThunk.rejected,
                (state, {payload}) => {
                    state.listStagesState = 'ERRORED'
                    state.listStagesError = payload
                    state.listOfStages = undefined
                }
            )
            builder.addCase(
                assignModelToStageThunk.pending,
                (state) => {
                    state.assignModelToStageState = 'PENDING'
                    state.assignModelToStageError = undefined
                    state.assignModelToStageInfoRead = undefined
                }
            )
            builder.addCase(
                assignModelToStageThunk.fulfilled,
                (state, {payload}) => {
                    state.assignModelToStageState = 'DONE'
                    state.assignModelToStageError = undefined
                    state.assignModelToStageInfoRead = payload
                }
            )
            builder.addCase(
                assignModelToStageThunk.rejected,
                (state, {payload}) => {
                    state.assignModelToStageState = 'ERRORED'
                    state.assignModelToStageError = payload
                    state.assignModelToStageInfoRead = undefined
                }
            )
            builder.addCase(
                readFullStageInfoThunk.pending,
                (state) => {
                    state.readFullStageInfoState = 'PENDING'
                    state.readFullStageInfoError = undefined
                    state.readFullStageInfo = undefined
                }
            )
            builder.addCase(
                readFullStageInfoThunk.fulfilled,
                (state, {payload}) => {
                    state.readFullStageInfoState = 'DONE'
                    state.readFullStageInfo = payload
                    state.readFullStageInfoError = undefined
                }
            )
            builder.addCase(
                readFullStageInfoThunk.rejected,
                (state, {payload}) => {
                    state.readFullStageInfoState = 'ERRORED'
                    state.readFullStageInfoError = payload
                    state.readFullStageInfo = undefined
                }
            )
        }
    }
)

const {actions, reducer} = slice;

export const {resetCreating, resetReadFull, resetList, resetAssign} = actions;

export default reducer;