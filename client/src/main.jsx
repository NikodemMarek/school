import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom"
import { Provider } from 'react-redux'
import store from './data/store.js'

import Root from './Root.jsx'
import Register from './auth/Register.jsx'
import Login from './auth/Login.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import Upload from './images/Upload.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
    },
    {
        path: "/auth/register",
        element: <Register />,
    },
    {
        path: "/auth/login",
        element: <Login />,
    },
    {
        path: "/images/upload",
        element: <Upload />,
    },
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <ChakraProvider>
                <RouterProvider router={router} />
            </ChakraProvider>
        </Provider>
    </React.StrictMode>,
)
