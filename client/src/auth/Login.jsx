import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { authActions } from '../data/store.js'
import { login } from '../data/auth.js'
import Input from '../components/Input.jsx'

const Login = () => {
    const dispatch = useDispatch()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState(undefined)

    const onSubmit = async (e) => {
        e.preventDefault()

        if (!email || !password)
            return setError('all fields are required')

        try {
            const data = await login(email, password)

            dispatch(authActions.setToken(data.token))

            navigate('/')
        } catch (err) {
            if (err === 'user_not_found')
                return setError('user not found')
        }
    }

    return (
        <div>
            <h1>Login</h1>
            
            <form onSubmit={onSubmit}>
                <Input type="email" label="email" value={email} onChange={setEmail} />

                <Input type="password" label="password" value={password} onChange={setPassword} />

                {error && <p
                    style={{
                        color: 'red',
                        fontSize: '0.8rem',
                    }}
                >{error}</p>}

                <button type="submit">login</button>
            </form>
            
            <Link to="/auth/register">register</Link>
        </div>
    )
}

export default Login
