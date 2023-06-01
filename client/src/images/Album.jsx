import React, { useState, useEffect } from 'react'
import { Flex, IconButton, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'

import EditIcon from '@mui/icons-material/Edit';

import { getAlbum } from './api'
import Upload from './Upload'
import LoadingImage from './LoadingImage'
import ViewImage from './ViewImage'

const Album = ({ id }) => {
    const editable = id === 'me'

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

    const [editId, setEditId] = useState(null)
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()

    return (
        <>
            <Flex
                flexWrap='wrap'
                gap={4}
            >
                {editable && (
                    <IconButton
                        icon={<AddIcon />}
                        w='200px'
                        h='200px'
                        onClick={onOpen}
                    />
                )}

                {images && images.map((image, index) => (
                    <Box key={index} pos='relative'>
                        {editable && (
                            <IconButton
                                pos='absolute'
                                right='0'
                                icon={<EditIcon />}
                                onClick={() => {
                                    setEditId(image.id)
                                    onOpenEdit()
                                }}
                            />
                        )}

                        <Link to={`/images/${image.id}`}>
                            <LoadingImage
                                src={image.url}
                                alt={image.name}
                                w='200px'
                                h='200px'
                                box='200px'
                            />
                        </Link>
                    </Box>
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

            <Modal
                isOpen={isOpenEdit}
                onClose={onCloseEdit}
                size='xl'
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>edit image</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <ViewImage id={editId} editable={editable} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Album
