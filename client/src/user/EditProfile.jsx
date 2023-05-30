import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Flex, FormControl, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, FormLabel, Box } from '@chakra-ui/react'

import { setUserData, setUserProfilePicture } from './api'
import Dropzone from '../images/Dropzone'

const EditProfile = ({ isOpen, onClose, user }) => {
    const navigate = useNavigate()

    const [photo, setPhoto] = useState(null)

    const [name, setName] = useState(user?.name || '')
    const [lastName, setLastName] = useState(user?.lastName || '')

    const [error, setError] = useState(undefined)

    useEffect(() => {
        setError(undefined)
    }, [name, lastName])

    const onSubmit = async () => {
        if (!name || !lastName)
            return setError('all fields are required')

        try {
            await setUserData(name, lastName)

            if (photo)
                await setUserProfilePicture(photo)

            onClose()
        } catch (error) {
            if (error === 'unauthorized')
                navigate('/auth/login', { replace: true })

            return setError(error)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>edit your profile</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <Flex>
                    <Box
                        w="160px"
                        h="160px"
                    >
                        <Dropzone multiple={false} setAccepted={(photo) => setPhoto(photo[0])}>
                            {
                                photo
                                    ? <>uploaded<br />{photo?.name}</>
                                    : <Avatar name={user?.name} src={`http://localhost:3000${user?.profilePicture}`} size="2xl" />
                            }
                        </Dropzone>
                    </Box>

                    <FormControl ml={6}>
                        <FormLabel>first name</FormLabel>
                        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />

                        <FormLabel>last name</FormLabel>
                        <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />

                        {error && <p
                            style={{
                                color: 'red',
                                fontSize: '0.8rem',
                            }}
                        >{error}</p>}
                    </FormControl>
                </Flex>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onSubmit} mr={3} colorScheme="blue">save</Button>

                <Button onClick={onClose}>cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
    )
}

export default EditProfile
