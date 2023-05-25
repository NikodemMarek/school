import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { authActions } from './data/store.js'

const Root = () => {
    const token = useSelector((state) => state.auth.token)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!token)
            navigate('/auth')
    })

    return (
        <div>
            <h1>Root</h1>
            {
                token && (
                    <button onClick={() => dispatch(authActions.logout())}>logout</button>
                )
            }
        </div>
    )
}

export default Root
