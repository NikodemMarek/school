;(async () => {
    const items = await fetch('http://localhost:3000/data')
        .then((res) => res.json())
        .then(({items}) => items)

    console.log(items[0])
    const parsePrice = (price) => {
        const [dollars, centsRaw] = `${price}`.split('.')
        const cents = centsRaw.slice(0, 2)
        return `$${dollars}.${cents}`
    }

    const Star = ({stars, url}) => (
        <div className='stars row'>
            <p>Rating ({stars}):</p>

            <div className='row'>
                {Array.from({length: stars}, (_, i) => (
                    <img src={url} className='stars-star' />
                ))}
            </div>
        </div>
    )

    const Product = ({
        category,
        description,
        img_url,
        price,
        product_url,
        slogan,
        stars,
        title,
    }) => (
        <div className='product'>
            <div className='product-slogan'>{slogan}</div>

            <div className='col center'>
                <img src={product_url} className='product-img' />
                <h1>{title}</h1>
            </div>

            <div className='row'>
                <p>{parsePrice(price)}</p>
                <p className='product-category'>{category}</p>
            </div>

            <Star stars={stars} url={img_url} />

            <div className='product-description'>{description}</div>
        </div>
    )

    const List = ({items}) => (
        <div className='grid'>
            {items.map((item) => (
                <Product {...item} />
            ))}
        </div>
    )

    ReactDOM.render(<List items={items} />, document.body)
})()
