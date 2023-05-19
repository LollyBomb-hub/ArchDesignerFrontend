import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import accountSlice from './reducers/accountReducer';
import projectSlice from './reducers/projectReducer';

const rootReducer = combineReducers(
    {
        accountSlice,
        projectSlice
    }
)

const store = configureStore({
    reducer: rootReducer,
    preloadedState: JSON.parse(localStorage.getItem("modular_solution") || "{}")
})

store.subscribe(
    () => {
        localStorage.setItem("modular_solution",JSON.stringify(store.getState()))
    }
)

export type IRootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export default store;