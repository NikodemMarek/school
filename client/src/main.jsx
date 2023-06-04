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
import ViewImage from './images/ViewImage.jsx'

const AuthNavbar = ({ children, active }) => {
    const token = useSelector((state) => state.auth.token)

    const navigate = useNavigate()

    useEffect(() => {
        if (!token)
            navigate('/auth/login')
    })

    return (
        <Navbar active={active} >
            {children}
        </Navbar>
    )
}

const ProfileRoute = ({ active }) => {
    const id = useLoaderData()
    return (
        <AuthNavbar active={active}>
            <User id={id} />
        </AuthNavbar>
    )
}
const ImageRoute = () => {
    const id = useLoaderData()
    return (
        <AuthNavbar active={0}>
            <ViewImage id={id} />
        </AuthNavbar>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthNavbar active={0} children={<Profiles />} />,
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
        path: "/users/me",
        element: <ProfileRoute active={1} />,
        loader: () => "me",
    },
    {
        path: "/users/:id",
        element: <ProfileRoute active={0} />,
        loader: ({ params }) => params.id,
    },
    {
        path: "/images/:id",
        element: <ImageRoute />,
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
