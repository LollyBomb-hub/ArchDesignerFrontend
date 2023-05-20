import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {LoadingState, MeshCompleteInfoRead, MeshInfoCreate, MeshMinInfoRead} from "../../server/interfaces";
import {IRootState} from "../store";
import {createMesh, listMeshs, readCompleteMesh, readMesh, readPlyOfMesh} from "../../server/api";


interface SliceState {
    meshCreatingState?: LoadingState
    createdMeshInfo?: MeshMinInfoRead
    meshCreatingError?: any
    listMeshesState?: LoadingState
    listOfMeshes?: MeshMinInfoRead[]
    listOfMeshesError?: any
    meshMinInfo?: MeshMinInfoRead
    readMeshMinInfoState?: LoadingState
    readMeshMinInfoError?: any
    completeMeshInfo?: MeshCompleteInfoRead
    readCompleteMeshInfoState?: LoadingState
    readCompleteMeshInfoError?: any
    plyContents?: string
    readPlyContentsState?: LoadingState
    readPlyContentsError?: any
}

const initialState: SliceState = {}

export const createMeshThunk = createAsyncThunk(
    "mesh/create",
    async (mic: MeshInfoCreate, {rejectWithValue, getState}) => {
        const state = getState() as IRootState;
        const token = state.accountSlice.token
        const response = await createMesh(token, mic)
        if (response.status === 200) {
            return response.data
        }
        return rejectWithValue(response.data)
    }
)

export const listMeshesThunk = createAsyncThunk(
    "mesh/list",
    async ({limit, offset}: { limit?: number, offset?: number }, {rejectWithValue, getState}) => {
        const state = getState() as IRootState;
        const token = state.accountSlice.token;
        const response = await listMeshs(token, limit, offset)
        if (response.status === 200) {
            return response.data
        }
        return rejectWithValue(response.data)
    }
)

export const readMeshThunk = createAsyncThunk(
    "mesh/readMin",
    async (mesh_id: number, {rejectWithValue, getState}) => {
        const state = getState() as IRootState;
        const token = state.accountSlice.token;
        const response = await readMesh(token, mesh_id)
        if (response.status === 200) {
            return response.data
        }
        return rejectWithValue(response.data)
    }
)

export const readCompleteMeshThunk = createAsyncThunk(
    "mesh/complete",
    async (mesh_id: number, {rejectWithValue, getState}) => {
        const state = getState() as IRootState;
        const token = state.accountSlice.token;
        const response = await readCompleteMesh(token, mesh_id);
        if (response.status === 200) {
            return response.data
        }
        return rejectWithValue(response.data)
    }
)

export const readPlyOfMeshThunk = createAsyncThunk(
    "mesh/ply",
    async (mesh_id: number, {rejectWithValue, getState}) => {
        const state = getState() as IRootState;
        const token = state.accountSlice.token;
        const response = await readPlyOfMesh(token, mesh_id);
        if (response.status === 200) {
            return response.data
        }
        return rejectWithValue(response.data)
    }
)

const slice = createSlice(
    {
        name: "meshSlice",
        initialState: initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(
                createMeshThunk.pending,
                (state) => {
                    state.meshCreatingState = 'PENDING'
                    state.createdMeshInfo = undefined
                    state.meshCreatingError = undefined
                }
            )
            builder.addCase(
                createMeshThunk.fulfilled,
                (state, action) => {
                    state.meshCreatingState = 'DONE'
                    state.createdMeshInfo = action.payload
                    state.meshCreatingError = undefined
                }
            )
            builder.addCase(
                createMeshThunk.rejected,
                (state, action) => {
                    state.meshCreatingState = 'ERRORED'
                    state.meshCreatingError = action.payload
                    state.createdMeshInfo = undefined
                }
            )
            builder.addCase(
                listMeshesThunk.pending,
                (state) => {
                    state.listMeshesState = 'PENDING'
                    state.listOfMeshesError = undefined
                    state.listOfMeshes = undefined
                }
            )
            builder.addCase(
                listMeshesThunk.fulfilled,
                (state, action) => {
                    state.listMeshesState = 'DONE'
                    state.listOfMeshes = action.payload
                    state.listOfMeshesError = undefined
                }
            )
            builder.addCase(
                listMeshesThunk.rejected,
                (state, action) => {
                    state.listMeshesState = 'ERRORED'
                    state.listOfMeshes = undefined
                    state.listOfMeshesError = action.payload
                }
            )
            builder.addCase(
                readMeshThunk.pending,
                (state, action) => {
                    state.readMeshMinInfoState = 'PENDING'
                    state.readMeshMinInfoError = undefined
                    state.meshMinInfo = undefined
                }
            )
            builder.addCase(
                readMeshThunk.fulfilled,
                (state, action) => {
                    state.readMeshMinInfoState = 'DONE'
                    state.readMeshMinInfoError = undefined
                    state.meshMinInfo = action.payload
                }
            )
            builder.addCase(
                readMeshThunk.rejected,
                (state, action) => {
                    state.readMeshMinInfoState = 'ERRORED'
                    state.readMeshMinInfoError = action.payload
                    state.meshMinInfo = undefined
                }
            )
            builder.addCase(
                readCompleteMeshThunk.pending,
                (state) => {
                    state.completeMeshInfo = undefined
                    state.readCompleteMeshInfoError = undefined
                    state.readCompleteMeshInfoState = 'PENDING'
                }
            )
            builder.addCase(
                readCompleteMeshThunk.fulfilled,
                (state, action) => {
                    state.completeMeshInfo = action.payload
                    state.readCompleteMeshInfoState = 'DONE'
                    state.readCompleteMeshInfoError = undefined
                }
            )
            builder.addCase(
                readCompleteMeshThunk.rejected,
                (state, action) => {
                    state.completeMeshInfo = undefined
                    state.readCompleteMeshInfoState = 'ERRORED'
                    state.readCompleteMeshInfoError = action.payload
                }
            )
            builder.addCase(
                readPlyOfMeshThunk.pending,
                (state) => {
                    state.readPlyContentsState = 'PENDING'
                    state.plyContents = undefined
                    state.readPlyContentsError = undefined
                }
            )
            builder.addCase(
                readPlyOfMeshThunk.fulfilled,
                (state, action) => {
                    state.plyContents = action.payload
                    state.readPlyContentsError = undefined
                    state.readPlyContentsState = 'DONE'
                }
            )
            builder.addCase(
                readPlyOfMeshThunk.rejected,
                (state, action) => {
                    state.plyContents = undefined
                    state.readPlyContentsState = 'ERRORED'
                    state.readPlyContentsError = action.payload
                }
            )
        }
    }
)

const {actions, reducer} = slice;

export const {} = actions;

export default reducer;