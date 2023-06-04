import { useEffect, useState } from 'react'
import { Flex, Input, Tag, TagRightIcon } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

import { getImageTags, tagImage, createTag } from './api'

const MAX_TAG_LENGTH = 30

const ImageTags = ({ id, editable }) => {
    const [tags, setTags] = useState(null)

    const [newTag, setNewTag] = useState('')

    useEffect(() => {
        (async () => {
            try {
                setTags(await getImageTags(id))
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    const addTag = async () => {
        if (newTag === '')
            return

        try {
            const tag = await createTag(newTag)
            await tagImage(id, [ tag.id ])

            setNewTag('')
            setTags(await getImageTags(id))
        } catch (error) {
            console.log(error)
        }
    }

    const getColorByPopularity = (popularity) => {
        const colors = [ 'gray', 'pink', 'green', 'blue', 'purple', 'yellow', 'orange', 'red' ]
        const popularityStep = 100 / colors.length

        for (let i = 0; i < colors.length; i++)
            if (popularity <= popularityStep * (i + 1))
                return colors[i]
    }

    return (
        <Flex
            w='100%'
            gap={2}
            flexWrap='wrap'
            align='center'
            padding={4}
        >
            {tags && tags.map((tag, index) => (
                <Tag
                    size='lg'
                    borderRadius='full'
                    key={index}
                    colorScheme={getColorByPopularity(tag.popularity)}
                >
                    {tag.name}
                </Tag>
            ))}

            {editable && (
                <Tag
                    size='lg'
                    borderRadius='full'
                >
                    <Input
                        placeholder='new tag'
                        variant='unstyled'
                        value={newTag}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter')
                                return addTag()
                        }}
                        onChange={(e) => {
                            if (e.target.value.length > MAX_TAG_LENGTH)
                                return

                            setNewTag(e.target.value)
                        }}
                    />
                    <TagRightIcon
                        as={AddIcon}
                        _hover={{
                            cursor: 'pointer',
                            color: 'gray.500'
                        }}
                        onClick={addTag}
                    />
                </Tag>
            )}
        </Flex>
    )
}

export default ImageTags
