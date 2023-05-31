import React, { useEffect } from 'react'
import { Flex, Skeleton, Image as ChakraImage, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { getAlbum } from './api'
import { AddIcon } from '@chakra-ui/icons'

import Upload from './Upload'

const Album = ({ album }) => {
    const [images, setImages] = React.useState(null)

    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        (async () => {
            try {
                setImages((await getAlbum(album)).photos)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [isOpen])

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
                        <Upload onUpload={onClose} />
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
            w='200px'
            h='200px'
        >
            <ChakraImage
                src={img.src}
                alt={alt}
                boxSize="200px"
                borderRadius="md"
                fit="cover"
            />
        </Skeleton>
    )
}

export default Album
