import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
    useLoaderData,
} from "react-router-dom"
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import store from './data/store.js'

import Root from './Root.jsx'

import Register from './user/Register.jsx'
import Login from './user/Login.jsx'
import Profiles from './user/Profiles.jsx'
import User from './user/User.jsx'
import Navbar from './Navbar.jsx'

const NavRoute = ({ children, active }) => {
    return (
        <Navbar active={active} >
            {children}
        </Navbar>
    )
}
const ProfileRoute = () => {
    const id = useLoaderData()
    return (
        <NavRoute active={1}>
            <User id={id} />
        </NavRoute>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <NavRoute active={0} children={<Profiles />} />,
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
        path: "/users/:id",
        element: <ProfileRoute />,
        loader: ({ params }) => params.id,
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
