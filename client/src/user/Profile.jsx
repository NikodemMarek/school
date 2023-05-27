import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Flex, Heading } from '@chakra-ui/react'

import { getUser } from './api'
import { getImage } from '../images/api'

const Profile = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                const user = await getUser()
                const photo = await getImage(user.profilePicture)

                setUser({ ...user, profilePhoto: photo.url })
            } catch (error) {
                if (error === 'unauthorized')
                    navigate('/auth/login', { replace: true })
            }
        })()
    }, []);

    return (
        <Flex
            direction="row"
            alignItems="center"
            gap={4}
            p={4}
        >
            <Avatar name={user?.name} src={`http://localhost:3000${user?.profilePhoto}`} size="2xl" />

            <Flex direction="column">
                <Heading>{user?.name} {user?.lastName}</Heading>

                <Heading>{user?.email}</Heading>
            </Flex>
        </Flex>
    )
}

export default Profile
