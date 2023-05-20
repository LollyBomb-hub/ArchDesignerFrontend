import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {LoadingState, StageInfoCreate, StageInfoRead, StageToModelLinkInfoRead} from "../../server/interfaces";
import {IRootState} from "../store";
import {assignModelToStage, createStage, listStages, readFullStageInfo} from "../../server/api";

interface SliceState {
    createStageState?: LoadingState
    createStageError?: any
    createdStage?: StageInfoRead
    listStagesState?: LoadingState
    listStagesError?: any
    listOfStages?: StageInfoRead[]
}

const initialState: SliceState = {}

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
        reducers: {},
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

                }
            )
        }
    }
)

const {actions, reducer} = slice;

export const {} = actions;

export default reducer;