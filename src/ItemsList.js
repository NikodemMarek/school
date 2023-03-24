import './ItemsList.css'

import Item from './Item'

const ItemsList = ({items, onRemove}) => (
    <div className='ItemsList'>
        {items.map((item, key) => (
            <Item {...item} onRemove={() => onRemove(key)} key={key} />
        ))}
    </div>
)

export default ItemsList
