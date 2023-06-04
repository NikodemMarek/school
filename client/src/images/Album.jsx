import React, { useState, useEffect } from 'react'
import { Flex, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, useBoolean } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { AddIcon } from '@chakra-ui/icons'
import EditIcon from '@mui/icons-material/Edit';
import FilterBAndWIcon from '@mui/icons-material/FilterBAndW';

import { getAlbum } from './api'
import Upload from './Upload'
import LoadingImage from './LoadingImage'
import { ViewImageWithTags } from './ViewImage'
import ViewImageWithFilters from './FilterImage'

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

    const { isOpen: isOpenTags, onOpen: onOpenTags, onClose: onCloseTags } = useDisclosure()
    const { isOpen: isOpenFilters, onOpen: onOpenFilters, onClose: onCloseFilters } = useDisclosure()

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
                    <AlbumImage
                        key={index}
                        id={image.id}
                        url={image.url}
                        name={image.name}
                        editable={editable}
                        openTags={() => {
                            setEditId(image.id)
                            onOpenTags()
                        }}
                        openFilters={() => {
                            setEditId(image.id)
                            onOpenFilters()
                        }}
                    />
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
                isOpen={isOpenTags}
                onClose={onCloseTags}
                size='xl'
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>edit tags</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <ViewImageWithTags id={editId} editable={editable} />
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isOpenFilters}
                onClose={onCloseFilters}
                size='xl'
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>apply filter</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <ViewImageWithFilters id={editId} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

const AlbumImage = ({ id, url, name, editable, openTags, openFilters }) => {
    const [menuVisible, setMenuVisible] = useBoolean(false)

    return (
        <Flex onMouseEnter={setMenuVisible.on} onMouseLeave={setMenuVisible.off} position='relative'>
            <Link to={`/images/${id}`}>
                <LoadingImage
                    src={url}
                    alt={name}
                    w='200px'
                    h='200px'
                    box='200px'
                />
            </Link>

            <Flex
                direction='column'
                gap={1}
                padding={1}
                position='absolute'
                right='0'
                display={menuVisible ? 'flex' : 'none'}
            >
                {editable && (
                    <IconButton
                        right='0'
                        icon={<EditIcon />}
                        onClick={openTags}
                    />
                )}

                <IconButton
                    right='0'
                    icon={<FilterBAndWIcon />}
                    onClick={openFilters}
                />
            </Flex>
        </Flex>
    )
}

export default Album
