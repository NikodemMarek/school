import React, { useState, useEffect } from 'react'
import { Flex, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { getAlbum } from './api'
import { AddIcon } from '@chakra-ui/icons'

import Upload from './Upload'
import LoadingImage from './LoadingImage'
import { Link } from 'react-router-dom'

const Album = ({ id }) => {
    const [images, setImages] = useState(null)

    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        (async () => {
            try {
                setImages((await getAlbum(id)).photos)
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
                {id === 'me' && (
                    <IconButton
                        icon={<AddIcon />}
                        w='200px'
                        h='200px'
                        onClick={onOpen}
                    />
                )}

                {images && images.map((image, index) => (
                    <Link to={`/images/${image.id}`} key={index}>
                        <LoadingImage
                            src={image.url}
                            alt={image.name}
                            w='200px'
                            h='200px'
                            box='200px'
                        />
                    </Link>
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

export default Album
