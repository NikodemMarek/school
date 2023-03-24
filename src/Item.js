import './Item.css'

const Item = ({title, content, onRemove}) => {
    const remove = () => {
        const confirmed = window.confirm(
            `are you sure you want to remove "${title}"?`
        )

        if (confirmed) onRemove()
    }

    return (
        <div className='Item'>
            <h2>{title}</h2>

            <p>{content}</p>

            <button onClick={remove}>remove</button>
        </div>
    )
}

export default Item
