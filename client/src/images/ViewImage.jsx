import React, { useState, useEffect } from 'react'

import { getImage } from './api'
import LoadingImage from './LoadingImage'
import { Flex, Heading } from '@chakra-ui/react'

const ViewImage = ({ id }) => {
    const [image, setImage] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                setImage(await getImage(id))
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    return (
        <Flex
            w='100%'
            flexDir='column'
            gap={4}
            alignItems='center'
        >
            <LoadingImage src={image?.url} alt={image?.name} />

            <Heading>{image?.name}</Heading>
        </Flex>
    )
}

export default ViewImage
