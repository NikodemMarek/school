import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Button, Flex, Heading, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react'

import { getUserProfile } from './api'
import EditProfile from './EditProfile'

const Profile = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState(null)

    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        (async () => {
            try {
                setUser(await getUserProfile())
            } catch (error) {
                if (error === 'unauthorized')
                    navigate('/auth/login', { replace: true })
            }
        })()
    }, [isOpen])

    if (!user)
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
            direction="row"
            alignItems="center"
            gap={4}
            p={4}
        >
            <Avatar name={user?.name} src={user?.profilePicture} size="2xl" />

            <Flex direction="column">
                <Heading>{user?.name} {user?.lastName}</Heading>

                <Heading>{user?.email}</Heading>
            </Flex>

            <Button onClick={onOpen}>edit</Button>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="xl"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>edit profile</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody pb={6}>
                        <EditProfile onSave={onClose} user={user} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    )
}

export default Profile
