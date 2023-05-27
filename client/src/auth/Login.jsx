import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Flex, FormControl, FormLabel, Heading, Input, Link } from '@chakra-ui/react'

import { authActions } from '../data/store'
import { login } from './api'

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState(undefined)

    const onSubmit = async (e) => {
        e.preventDefault()

        if (!email || !password)
            return setError('all fields are required')

        try {
            const data = await login(email, password)

            dispatch(authActions.setToken(data))

            navigate('/')
        } catch (err) {
            if (err === 'user_not_found')
                return setError('user not found')
        }
    }

    return (
        <Flex direction="column" gap="2">
            <Heading>Login</Heading>
            
            <FormControl isInvalid={error}>
                <FormLabel>email</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <FormLabel>password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                {error && <p
                    style={{
                        color: 'red',
                        fontSize: '0.8rem',
                    }}
                >{error}</p>}
            </FormControl>

            <Button onClick={onSubmit}>login</Button>
            
            <Link href="/auth/register">register</Link>
        </Flex>
    )
}

export default Login
