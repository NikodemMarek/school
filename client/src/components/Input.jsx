import React, { useState, useEffect } from 'react'

import './Input.css'

const Input = ({ type, placeholder, value, onChange }) => {
    const [inputValue, setInputValue] = useState(value)

    return (
        <input
            className="Input"
            type={type}
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => {
                setInputValue(e.target.value)
                onChange(e.target.value)
            }}
        />
    )
}

export default Input
