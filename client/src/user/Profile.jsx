import React, { useState, useEffect } from 'react'
import { getUser } from './api'
import { useNavigate } from 'react-router-dom'
import { Flex, Heading } from '@chakra-ui/react'

const Profile = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState(null)

    useEffect(() => {
        getUser()
            .then((user) => setUser(user))
            .catch((error) => {
                if (error === 'unauthorized')
                    navigate('/auth/login', { replace: true })
            })
    }, []);

    return (
        <Flex direction="column">
            <Heading>profile</Heading>

            <Heading>{user?.name} {user?.lastName}</Heading>

            <Heading>{user?.email}</Heading>
        </Flex>
    )
}

export default Profile
