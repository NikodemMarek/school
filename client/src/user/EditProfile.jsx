import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Button, Flex, Box, FormControl, FormLabel, Input } from '@chakra-ui/react'

import { setUserData, setUserProfilePicture } from './api'
import Dropzone from '../images/Dropzone'

const EditProfile = ({ onSave, user }) => {
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

            onSave()
        } catch (error) {
            if (error === 'unauthorized')
                navigate('/auth/login', { replace: true })

            return setError(error)
        }
    }

    return (<>
        <Flex
            gap={4}
            w="100%"
        >
            <Box
                w="160px"
                h="160px"
            >
                <Dropzone multiple={false} setAccepted={(photo) => setPhoto(photo[0])}>
                    {
                        photo
                            ? <>uploaded<br />{photo?.name}</>
                            : <Avatar name={user?.name} src={user?.profilePicture} size="2xl" />
                    }
                </Dropzone>
            </Box>

            <FormControl>
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

        <Button onClick={onSubmit} mt={4} w="100%">save</Button>
    </>)
}

export default EditProfile
