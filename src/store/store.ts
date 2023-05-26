import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import accountSlice from './reducers/accountReducer';
import projectSlice from './reducers/projectReducer';
import stageSlice from './reducers/stageReducer';
import meshSlice from './reducers/meshReducer';
import modelSlice from './reducers/modelReducer';

const rootReducer = combineReducers(
    {
        accountSlice,
        projectSlice,
        meshSlice,
        modelSlice,
        stageSlice
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