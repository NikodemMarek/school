import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Flex, Heading, Button } from '@chakra-ui/react'

import { authActions } from './data/store.js'
import Profile from './user/Profile.jsx'
import Album from './images/Album.jsx'

const Root = () => {
    const token = useSelector((state) => state.auth.token)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!token)
            navigate('/auth/login')
    })

    if (!token)
        return <Heading>please login</Heading>

    return (
        <Flex
            direction="column"
            p={4}
            gap={4}
        >
            <Button onClick={() => dispatch(authActions.logout())}>logout</Button>

            <Profile />

            <Album album={0} />
        </Flex>
    )
}

export default Root
