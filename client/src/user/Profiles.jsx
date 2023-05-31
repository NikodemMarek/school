import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Flex, Avatar, Heading, Spinner } from '@chakra-ui/react'

import { getUserProfiles } from './api'

const Profiles = () => {
    const [profiles, setProfiles] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                setProfiles(await getUserProfiles())
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    if (!profiles)
        return (
            <Flex
                direction="column"
                alignItems="center"
                justifyContent="center"
                h="100vh"
            >
                <Spinner size="xl" />
            </Flex>
        )

    return (
        <Flex
            flexWrap='wrap'
            gap={4}
            p={4}
        >
            {profiles && profiles.map((profile, index) => (
                <ProfilePreview
                    key={index}
                    id={profile.id}
                    name={profile.name}
                    lastName={profile.lastName}
                    profilePicture={profile.profilePicture}
                />
            ))}
        </Flex>
    )
}

const ProfilePreview = ({ id, name, lastName, profilePicture }) => {
    return (
        <Link to={`/users/${id}`}>
            <Flex
                flexDir='column'
                alignItems='center'
                justifyContent='center'
                bg='gray.200'
                w='200px'
                h='200px'
                borderRadius='lg'
                overflow='hidden'
                gap={2}
            >
                <Avatar name={name} src={profilePicture} size="2xl" />
                <Heading noOfLines={1}>{name} {lastName}</Heading>
            </Flex>
        </Link>
    )
}

export default Profiles
