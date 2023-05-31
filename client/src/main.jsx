import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom"
import { ChakraProvider, Flex } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import store from './data/store.js'

import Navbar from './Navbar.jsx'

import Root from './Root.jsx'

import Register from './user/Register.jsx'
import Login from './user/Login.jsx'
import Profile from './user/Profile.jsx'

const NavRoute = ({ children, active }) => {
    return (
        <Flex
            direction="row"
            height="100vh"
            width="100vw"
        >
            <Navbar active={active} />

            {children}
        </Flex>
    )
}
const router = createBrowserRouter([
    {
        path: "/",
        element: <NavRoute active={0} children={<Root />} />,
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
        path: "/profile",
        element: <NavRoute active={1} children={<Root />} />,
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
