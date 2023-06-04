import React, { useState } from 'react'
import { Skeleton, Image as ChakraImage } from '@chakra-ui/react'

const LoadingImage = ({ src, alt, w, h, box, filter }) => {
    const [isLoaded, setIsLoaded] = useState(false)

    const img = new Image()
    img.onload = () => setIsLoaded(true)
    img.src = src

    return (
        <Skeleton
            isLoaded={isLoaded}
            w={w}
            h={h}
        >
            <ChakraImage
                src={img.src}
                alt={alt}
                boxSize={box}
                borderRadius="md"
                fit="cover"
                filter={filter}
            />
        </Skeleton>
    )
}

export default LoadingImage
