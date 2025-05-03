import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from '@/redux/slice/loadingSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '@/redux/slice/auth/authSlice';
import categoryReducer from '@/redux/slice/category/categorySlice';
import requestReducer from '@/redux/slice/request-type/requestTypeSlice';
import requestAnalyticsReducer from '@/redux/slice/request-analytics/requestAnalyticsSlice';
import userReducer from '@/redux/slice/users/usersSlice';



const persistConfig = {
    key: 'root',
    storage,
};


const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedCategoryReducer = persistReducer(persistConfig, categoryReducer);
const persistedRequestTypeReducer = persistReducer(persistConfig, requestReducer);
const persistedRequestAnalyticsReducer = persistReducer(persistConfig, requestAnalyticsReducer);
const persistedUserReducer = persistReducer(persistConfig, userReducer);




export const store = configureStore({
    reducer: {
        loading: loadingReducer,
        auth: persistedAuthReducer,
        category: persistedCategoryReducer,
        request: persistedRequestTypeReducer,
        requestAnalytics: persistedRequestAnalyticsReducer,
        user: persistedUserReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);