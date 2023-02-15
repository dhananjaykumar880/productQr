import { AnyAction, combineReducers, configureStore, ThunkDispatch } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { productApi } from './product/productApi';
import _ from 'lodash';
import { batchedSubscribe } from 'redux-batched-subscribe';
import logger from 'redux-logger';

export const rootReducer = combineReducers({
    [productApi.reducerPath]: productApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type ThunkDispatcher = ThunkDispatch<RootState, any, AnyAction>;
export const useTypedDispatch = (): ThunkDispatcher => useDispatch<ThunkDispatcher>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const debounceNotify = _.debounce(notify => notify());
export default function createStore(initialState?: RootState) {
    return configureStore({
        reducer: rootReducer,
        preloadedState: initialState,
        devTools: process.env.NODE_ENV !== 'production',
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([productApi.middleware, logger]),
        enhancers: [batchedSubscribe(debounceNotify)]
    });
}