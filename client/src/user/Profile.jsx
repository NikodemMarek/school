import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Avatar, Button, Flex, Heading, SkeletonCircle, SkeletonText, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react'

import { authActions } from '../data/store'
import { getUserProfile } from './api'
import EditProfile from './EditProfile'

const Profile = ({ id }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [user, setUser] = useState(null)

    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        (async () => {
            try {
                setUser(await getUserProfile(id))
            } catch (error) {
                console.log('fasdfasdf', error)
                if (error === 'unauthorized')
                    navigate('/auth/login', { replace: true })
            }
        })()
    }, [isOpen])

    return (
        <Flex
            direction="row"
            alignItems="center"
            gap={4}
            p={4}
        >
            {user ? (<>
                <Avatar name={user.name} src={user.profilePicture} size="2xl" />

                <Flex direction="column">
                    <Heading>{user.name} {user.lastName}</Heading>

                    <Heading>{user.email}</Heading>
                </Flex>

                {id === 'me' && (<>
                    <Button onClick={onOpen}>edit</Button>
                    <Button onClick={() => {
                        dispatch(authActions.logout())
                        navigate('/auth/login', { replace: true })
                    }}>logout</Button>

                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        size="xl"
                        isCentered
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
                </>)}
            </>) : (<>
                <SkeletonCircle size='32' />
                <SkeletonText noOfLines={2} spacing={4} width={96} skeletonHeight={8} />
            </>)}
        </Flex>
    )
}

export default Profile
