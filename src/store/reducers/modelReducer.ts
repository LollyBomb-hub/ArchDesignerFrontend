import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    LoadingState,
    ModelCompleteInfoRead,
    ModelInfoCreate,
    ModelMinifiedInfoRead,
    OffsetLimitInterface
} from "../../server/interfaces";
import {IRootState} from "../store";
import {countModels, listModels, processResponse, readFullModel, readIfcOfModel, uploadModel} from "../../server/api";

interface SliceState {
    uploadState?: LoadingState
    uploadError?: any
    uploadedModel?: ModelMinifiedInfoRead
    listModelsState?: LoadingState
    listModelsError?: any
    listModels?: ModelMinifiedInfoRead[]
    fullModel?: ModelCompleteInfoRead
    fullModelReadState?: LoadingState
    fullModelReadError?: any
    ifcFile?: string
    ifcFileReadState?: LoadingState
    ifcFileReadError?: any
    modelsCount?: number
    modelsCountLoadState?: LoadingState
    modelsCountLoadError?: any
    limit: number
    page: number
    uploadingModel: boolean
}

const initialState: SliceState = {
    limit: 10,
    page: 1,
    uploadingModel: false
}


export interface UploadModelInfo {
    modelInfoCreate: ModelInfoCreate,
    ifcFile: string
}


export const uploadModelThunk = createAsyncThunk(
    'models/create',
    async ({modelInfoCreate, ifcFile}: UploadModelInfo, {rejectWithValue, getState}) => {
        const token = (getState() as IRootState).accountSlice.token;
        const response = await uploadModel(token, modelInfoCreate, ifcFile);
        return processResponse(response, rejectWithValue)
    }
)

export const countModelsThunk = createAsyncThunk(
    'model/count',
    async (_: void, {rejectWithValue, getState}) => {
        const token = (getState() as IRootState).accountSlice.token;
        const response = await countModels(token);
        return processResponse(response, rejectWithValue)
    }
)

export const listModelsThunk = createAsyncThunk(
    'models/list',
    async (_: void, {rejectWithValue, getState}) => {
        const state = getState() as IRootState;
        const token = state.accountSlice.token;
        const limit = state.modelSlice.limit;
        const page = state.modelSlice.page;
        const response = await listModels(token, limit, (page - 1) * limit)
        return processResponse(response, rejectWithValue)
    }
)

export const readFullModelThunk = createAsyncThunk(
    'models/full',
    async (model_id: number, {rejectWithValue, getState}) => {
        const token = (getState() as IRootState).accountSlice.token;
        const response = await readFullModel(token, model_id);
        return processResponse(response, rejectWithValue)
    }
)

export const readIfcOfModelThunk = createAsyncThunk(
    'model/ifc',
    async (model_id: number, {rejectWithValue, getState}) => {
        const token = (getState() as IRootState).accountSlice.token;
        const response = await readIfcOfModel(token, model_id);
        return processResponse(response, rejectWithValue)
    }
)


const slice = createSlice(
    {
        name: 'modelSlice',
        initialState: initialState,
        reducers: {
            resetUpload: (state) => {
                state.uploadState = undefined
                state.uploadError = undefined
                state.uploadedModel = undefined
                state.uploadingModel = false
            },
            resetList: (state) => {
                state.listModelsState = undefined
                state.listModels = undefined
                state.listModelsError = undefined
            },
            resetFull: (state) => {
                state.fullModelReadState = undefined
                state.fullModel = undefined
                state.fullModelReadError = undefined
            },
            resetIfc: (state) => {
                state.ifcFile = undefined
                state.ifcFileReadState = undefined
                state.ifcFileReadError = undefined
            },
            resetCount: (state) => {
                state.modelsCount = undefined
                state.modelsCountLoadState = undefined
                state.modelsCountLoadError = undefined
            },
            setLimit: (state, action: PayloadAction<number>) => {
                state.limit = action.payload
            },
            setPage: (state, action: PayloadAction<number>) => {
                state.page = action.payload
            },
            isUploadingModel: (state, action: PayloadAction<boolean>) => {
                state.uploadingModel = action.payload
            },
        },
        extraReducers: builder => {
            builder.addCase(
                uploadModelThunk.pending,
                (state) => {
                    state.uploadState = 'PENDING'
                    state.uploadedModel = undefined
                    state.uploadError = undefined
                }
            )
            builder.addCase(
                uploadModelThunk.fulfilled,
                (state, {payload}) => {
                    state.uploadState = 'DONE'
                    state.uploadedModel = payload
                    state.uploadError = undefined
                }
            )
            builder.addCase(
                uploadModelThunk.rejected,
                (state, {payload}) => {
                    state.uploadState = 'ERRORED'
                    state.uploadError = payload
                    state.uploadedModel = undefined
                }
            )
            builder.addCase(
                listModelsThunk.pending,
                (state) => {
                    state.listModelsState = 'PENDING'
                    state.listModels = undefined
                    state.listModelsError = undefined
                }
            )
            builder.addCase(
                listModelsThunk.fulfilled,
                (state, {payload}) => {
                    state.listModelsState = 'DONE'
                    state.listModels = payload
                    state.listModelsError = undefined
                }
            )
            builder.addCase(
                listModelsThunk.rejected,
                (state, {payload}) => {
                    state.listModelsState = 'ERRORED'
                    state.listModels = undefined
                    state.listModelsError = payload
                }
            )
            builder.addCase(
                readFullModelThunk.pending,
                (state) => {
                    state.fullModelReadState = 'PENDING'
                    state.fullModel = undefined
                    state.fullModelReadError = undefined
                }
            )
            builder.addCase(
                readFullModelThunk.fulfilled,
                (state, {payload}) => {
                    state.fullModelReadState = 'DONE'
                    state.fullModelReadError = undefined
                    state.fullModel = payload
                }
            )
            builder.addCase(
                readFullModelThunk.rejected,
                (state, {payload}) => {
                    state.fullModelReadState = 'ERRORED'
                    state.fullModel = undefined
                    state.fullModelReadError = payload
                }
            )
            builder.addCase(
                readIfcOfModelThunk.pending,
                (state) => {
                    state.ifcFile = undefined
                    state.ifcFileReadState = 'PENDING'
                    state.ifcFileReadError = undefined
                }
            )
            builder.addCase(
                readIfcOfModelThunk.fulfilled,
                (state, {payload}) => {
                    state.ifcFile = payload
                    state.ifcFileReadError = undefined
                    state.ifcFileReadState = 'DONE'
                }
            )
            builder.addCase(
                readIfcOfModelThunk.rejected,
                (state, {payload}) => {
                    state.ifcFileReadState = 'ERRORED'
                    state.ifcFile = undefined
                    state.ifcFileReadError = payload
                }
            )
            builder.addCase(
                countModelsThunk.pending,
                (state) => {
                    state.modelsCount = undefined
                    state.modelsCountLoadState = 'PENDING'
                    state.modelsCountLoadError = undefined
                }
            )
            builder.addCase(
                countModelsThunk.fulfilled,
                (state, {payload}) => {
                    state.modelsCount = payload
                    state.modelsCountLoadState = 'DONE'
                    state.modelsCountLoadError = undefined
                }
            )
            builder.addCase(
                countModelsThunk.rejected,
                (state, {payload}) => {
                    state.modelsCount = undefined
                    state.modelsCountLoadState = 'ERRORED'
                    state.modelsCountLoadError = payload
                }
            )
        }
    }
)

const {actions, reducer} = slice;

export const {resetFull, resetIfc, resetUpload, resetList, resetCount, setLimit, setPage, isUploadingModel} = actions;

export default reducer;