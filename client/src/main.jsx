import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
    useLoaderData,
    useNavigate,
} from "react-router-dom"
import { ChakraProvider } from '@chakra-ui/react'
import { Provider, useSelector } from 'react-redux'
import store from './data/store.js'

import Register from './user/Register.jsx'
import Login from './user/Login.jsx'
import Profiles from './user/Profiles.jsx'
import User from './user/User.jsx'
import Navbar from './Navbar.jsx'

const AuthCheck = ({ children }) => {
    const token = useSelector((state) => state.auth.token)

    const navigate = useNavigate()

    useEffect(() => {
        if (!token)
            navigate('/auth/login')
    })

    return children
}
const NavRoute = ({ children, active }) => {
    return (
        <AuthCheck>
            <Navbar active={active} >
                {children}
            </Navbar>
        </AuthCheck>
    )
}
const ProfileRoute = () => {
    const id = useLoaderData()
    return (
        <AuthCheck>
            <NavRoute active={1}>
                <User id={id} />
            </NavRoute>
        </AuthCheck>
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
