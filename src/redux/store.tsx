import {configureStore} from '@reduxjs/toolkit'
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    persistStore,
    persistReducer,
} from 'redux-persist'
import reduxStorage from './storage'
import rootReducer from './rootReducer'
import thunk from 'redux-thunk'

const persistConfig = {
    key:'root',
    storage:reduxStorage,
    blacklist:[],
    whitelist:['user']// Add the slices you want to persist
}

const persistReducers = persistReducer(persistConfig,rootReducer)


export const store = configureStore({
    reducer: persistReducers,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            thunk: true, 
            serializableCheck: {
                ignoredActions: [FLUSH, REGISTER, REHYDRATE, PAUSE, PERSIST, PURGE]
            }
        })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch =typeof store.dispatch