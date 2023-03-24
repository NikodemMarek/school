import './CreateItem.css'
import {useState} from 'react'

const CreateItem = ({defaultTitle = '', defaultContent = '', onCreate}) => {
    const [title, setTitle] = useState(defaultTitle)
    const [content, setContent] = useState(defaultContent)

    return (
        <div className='CreateItem'>
            <h2>Create Item</h2>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    onCreate(title, content)
                }}
            >
                <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button type='submit'>set</button>
            </form>
        </div>
    )
}

export default CreateItem
