import React, { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { FormControl, FormLabel, Heading, Input, Link, Button, Flex, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'

import { register } from './api'

const Register = () => {
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')

    const [email, setEmail] = useState('')

    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const [error, setError] = useState(undefined)

    useEffect(() => {
        setError(undefined)
    }, [name, lastName, email, password, passwordConfirmation])

    const [confirmationToken, setConfirmationToken] = useState(null)

    const onSubmit = async (e) => {
        e.preventDefault()

        if (!name || !lastName || !email || !password || !passwordConfirmation)
            return setError('all fields are required')
        if (password !== passwordConfirmation)
            return setError('passwords do not match')

        try {
            const confirmationToken = await register(name, lastName, email, password)
            setConfirmationToken(confirmationToken)

            setTimeout(() => setConfirmationToken(null), 3600000)
        } catch (err) {
            if (err === 'user_already_exists')
                setError('user already exists')
        }
    }

    return (
        <Flex direction="column" gap="2">
            <Heading>register</Heading>

            <FormControl>
                <FormLabel>first name</FormLabel>
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <FormLabel>last name</FormLabel>
                <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />

                <FormLabel>email</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <FormLabel>password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <FormLabel>password confirmation</FormLabel>
                <Input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
            </FormControl>

            <Button onClick={onSubmit}>register</Button>

            {error && (
                <Alert status='error'>
                  <AlertIcon />
                  <AlertTitle>invalid input</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {confirmationToken && (
                <Alert status='success'>
                  <AlertIcon />
                  <AlertTitle>account created</AlertTitle>
                  <AlertDescription>please confirm your account by clicking <Link href={`http://localhost:3000/api/users/confirm/${confirmationToken}`} isExternal>here</Link></AlertDescription>
                </Alert>
            )}

            <RouterLink to="/auth/login">login</RouterLink>
        </Flex>
    );
}

export default Register
