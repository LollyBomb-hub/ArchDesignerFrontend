import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import moment from "moment";
import {AccountInfoRead, AuthorizationInfo, LoadingState, RegistrationInfo} from "../../server/interfaces";
import {authorize, getAccount, registerAccount} from "../../server/api";
import {IRootState} from "../store";

type SliceState = {
    registrationState?: LoadingState
    registrationError?: any
    loggedIn: boolean
    token: string
    error?: any
    errorAccountLoading?: any
    loadingState?: LoadingState
    accountLoadingState?: LoadingState
    expiresAt?: number
    accountInfoRead?: AccountInfoRead
    closedActionToolbar: boolean
    currentMenuItem: number
}

export const register = createAsyncThunk<AccountInfoRead, RegistrationInfo>(
    'accounts/register',
    async (payload, {rejectWithValue}) => {
        const response = await registerAccount(payload);
        if (response.status === 200) {
            return response.data
        }
        return rejectWithValue(response.data)
    }
)

export const auth = createAsyncThunk<string, AuthorizationInfo>(
    'accounts/auth',
    async (payload, {rejectWithValue}) => {
        const response = await authorize(payload)
        if (response.status === 200) {
            return response.data
        }
        return rejectWithValue(response.data)
    }
)

export const loadAccountInfo = createAsyncThunk<AccountInfoRead, void>(
    'accounts/get',
    async (_, {getState, rejectWithValue}) => {
        let state = getState() as IRootState;
        let token = state.accountSlice.token;
        const response = await getAccount(token)
        if (response.status === 200) {
            return response.data;
        }
        return rejectWithValue(response.data)
    }
)

const initialState: SliceState = {
    loggedIn: false,
    token: "",
    closedActionToolbar: true,
    currentMenuItem: 0
}

const slice = createSlice(
    {
        name: "accountSlice",
        initialState: initialState as SliceState,
        reducers: {
            selectMenuItem: (state, action: PayloadAction<number>) => {
                state.currentMenuItem = action.payload
            },
            toolbarClick: (state) => {
                state.closedActionToolbar = !state.closedActionToolbar
            },
            resetAccountInfo: (state) => {
                state.accountLoadingState = undefined
                state.accountInfoRead = undefined
            },
            resetAuthState: (state) => {
                state.token = ""
                state.error = ""
                state.loggedIn = false
                state.loadingState = undefined
                state.expiresAt = undefined
            },
            resetRegisterState: (state) => {
                state.registrationState = undefined
                state.registrationError = undefined
            },
            unlogin: (state) => {
                state.registrationState = undefined
                state.registrationError = undefined
                state.accountLoadingState = undefined
                state.accountInfoRead = undefined
                state.errorAccountLoading = ""
                state.token = ""
                state.error = ""
                state.loggedIn = false
                state.loadingState = undefined
                state.expiresAt = undefined
            }
        },
        extraReducers: builder => {
            builder.addCase(
                auth.pending,
                (state) => {
                    state.loadingState = 'PENDING'
                }
            );

            builder.addCase(
                auth.fulfilled,
                (state, action) => {
                    state.loadingState = 'DONE'
                    state.loggedIn = true
                    state.error = null
                    state.token = action.payload
                    state.expiresAt = moment(moment.now()).add(3600, "seconds").unix()
                }
            )

            builder.addCase(
                auth.rejected,
                (state, payload) => {
                    state.loadingState = 'ERRORED'
                    state.loggedIn = false
                    state.error = payload.payload
                    state.token = ""
                    state.expiresAt = undefined
                }
            )

            builder.addCase(
                loadAccountInfo.pending,
                (state) => {
                    state.accountLoadingState = 'PENDING'
                }
            )

            builder.addCase(
                loadAccountInfo.rejected,
                (state, payload) => {
                    state.accountLoadingState = 'ERRORED'
                    state.errorAccountLoading = payload.payload
                }
            )

            builder.addCase(
                loadAccountInfo.fulfilled,
                (state, payload) => {
                    state.accountLoadingState = 'DONE'
                    state.accountInfoRead = payload.payload
                }
            )

            builder.addCase(
                register.pending,
                (state) => {
                    state.registrationState = 'PENDING'
                }
            )

            builder.addCase(
                register.fulfilled,
                (state) => {
                    state.registrationState = 'DONE'
                }
            )

            builder.addCase(
                register.rejected,
                (state, action) => {
                    state.registrationState = 'ERRORED'
                    state.registrationError = action.payload
                }
            )
        }
    }
)

const {actions, reducer} = slice;

export const {toolbarClick, resetRegisterState, selectMenuItem, resetAccountInfo, unlogin, resetAuthState} = actions;

export default reducer;