import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { authActions } from '../data/store.js'
import { register } from '../data/auth.js'
import Input  from '../components/Input.jsx'

const Register = () => {
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')

    const [email, setEmail] = useState('')

    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const [error, setError] = useState(undefined)

    const dispatch = useDispatch()
    const navigate = useNavigate()

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
            const data = await register(name, lastName, email, password)

            dispatch(authActions.setToken(data.token))

            setTimeout(() => navigate('/'), 100)
        } catch (err) {
            if (err === 'user_already_exists')
                setError('user already exists')
        }
    }

    return (
        <div>
            <h1>register</h1>

            <form onSubmit={onSubmit}>
                <Input type="text" placeholder="name" value={name} onChange={setName} />
                <Input type="text" placeholder="last name" value={lastName} onChange={setLastName} />

                <Input type="email" placeholder="email" value={email} onChange={setEmail} />

                <Input type="password" placeholder="password" value={password} onChange={setPassword} />
                <Input type="password" placeholder="password confirmation" value={passwordConfirmation} onChange={setPasswordConfirmation} />

                {error && <p
                    style={{
                        color: 'red',
                        fontSize: '0.8rem',
                    }}
                >{error}</p>}

                <button type="submit">register</button>
            </form>

            <Link to="/auth/login">login</Link>
        </div>
    );
}

export default Register
