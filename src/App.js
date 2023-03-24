import './App.css'
import {useState} from 'react'

import CreateItem from './CreateItem'
import ItemsList from './ItemsList'
import Item from './Item'

function App() {
    const [items, setItems] = useState([
        {
            title: 'Item 1',
            content: 'This is the content of item 1',
        },
        {
            title: 'Item 2',
            content: 'This is the content of item 2',
        },
    ])

    const addItem = (title, content, where = items.length) =>
        setItems([
            ...items.slice(0, where),
            {title, content},
            ...items.slice(where),
        ])

    const [tmpItem, setTmpItem] = useState(null)

    return (
        <div className='App'>
            <div className='createForm'>
                <CreateItem
                    defaultTitle='Item x'
                    defaultContent='This is the content of item x'
                    onCreate={(newTitle, newContent) => {
                        const title = newTitle?.length <= 0 ? null : newTitle
                        const content =
                            newContent?.length <= 0 ? null : newContent

                        if (title) setTmpItem({title, content})
                    }}
                />
                {tmpItem && (
                    <Item {...tmpItem} onRemove={() => setTmpItem(null)} />
                )}
            </div>

            <div className='actions'>
                <button
                    onClick={() => {
                        if (tmpItem)
                            addItem(
                                tmpItem.title,
                                tmpItem.content,
                                items.length
                            )
                    }}
                >
                    add to the end
                </button>

                <button
                    onClick={() => {
                        if (tmpItem) addItem(tmpItem.title, tmpItem.content, 0)
                    }}
                >
                    add to the beginning
                </button>

                <button onClick={() => setItems([])}>clear</button>
            </div>

            <ItemsList
                items={items}
                onRemove={(key) =>
                    setItems(items.filter((_, index) => index !== key))
                }
            />
        </div>
    )
}

export default App
