import React, { useState, useEffect } from 'react'
import { Flex, Heading } from '@chakra-ui/react'

import { getImage } from './api'
import LoadingImage from './LoadingImage'
import ImageTags from '../tags/ImageTags'

const ViewImage = ({ id, editable }) => {
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

            <ImageTags id={id} editable={editable} />

            <Heading>{image?.name}</Heading>
        </Flex>
    )
}

export default ViewImage
