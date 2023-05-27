import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormControl, FormLabel, Heading, Input, Link, Button, Flex } from '@chakra-ui/react'

import { register } from './api'

const Register = () => {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')

    const [email, setEmail] = useState('')

    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const [error, setError] = useState(undefined)

    useEffect(() => {
        setError(undefined)
    }, [name, lastName, email, password, passwordConfirmation])

    const onSubmit = async (e) => {
        e.preventDefault()

        if (!name || !lastName || !email || !password || !passwordConfirmation)
            return setError('all fields are required')
        if (password !== passwordConfirmation)
            return setError('passwords do not match')

        try {
            await register(name, lastName, email, password)

            navigate('/auth/login')
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

                {error && <p
                    style={{
                        color: 'red',
                        fontSize: '0.8rem',
                    }}
                >{error}</p>}
            </FormControl>

            <Button onClick={onSubmit}>register</Button>

            <Link to="/auth/login">login</Link>
        </Flex>
    );
}

export default Register
