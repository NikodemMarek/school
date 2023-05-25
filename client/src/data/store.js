import { createSlice, configureStore } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
    },
    reducers: {
        init: (state) => {
            state.token = localStorage.getItem('token') || null
        },
        setToken: (state, action) => {
            state.token = action.payload
            localStorage.setItem('token', action.payload)
        },
        logout: (state) => {
            state.token = null
            localStorage.removeItem('token')
        }
    },
})

export const authActions = authSlice.actions

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
    },
})

store.dispatch(authSlice.actions.init())

export default store
