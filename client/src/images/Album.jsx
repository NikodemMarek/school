import React, { useEffect } from 'react'
import { Flex, Skeleton, Image as ChakraImage, IconButton, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { getAlbum } from './api'
import { AddIcon } from '@chakra-ui/icons'

import Upload from './Upload'

const Album = ({ album }) => {
    const [images, setImages] = React.useState(null)

    useEffect(() => {
        (async () => {
            try {
                const imgs = await getAlbum(album)
                setImages(imgs.photos)
                console.log(images)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Flex
                flexWrap='wrap'
                gap={4}
            >
                <IconButton
                    icon={<AddIcon />}
                    w='200px'
                    h='200px'
                    onClick={onOpen}
                />

                {images && images.map((image, index) => (
                    <ImageLoading key={index} src={image.url} alt={image.name} />
                ))}
            </Flex>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size='xl'
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>upload images</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Upload />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

const ImageLoading = ({ src, alt }) => {
    const [isLoaded, setIsLoaded] = React.useState(false)

    const img = new Image()
    img.onload = () => setIsLoaded(true)
    img.src = src

    return (
        <Skeleton
            isLoaded={isLoaded}
            fadeDuration={4}
            w='200px'
            h='200px'
        >
            <ChakraImage boxSize='200px' src={img.src} alt={alt} borderRadius="md" />
        </Skeleton>
    )
}

export default Album
