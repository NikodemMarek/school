import { useState, useEffect } from "react"
import { Flex, Select, Image as ChakraImage, Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark, Box, Button } from "@chakra-ui/react"

import { filterImage, getImage, getImageMetadata } from "./api"

const ViewImageWithFilters = ({ id }) => {
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

    const [filter, setFilter] = useState('metadata')
    const [filterProps, setFilterProps] = useState({})

    return (
        <Flex
            w='100%'
            flexDir='column'
            gap={8}
            mb={4}
        >
            <Select onChange={e => setFilter(e.target.value)}>
                <option value={'metadata'}>metadata</option>
                <option value={'rotate'}>rotate</option>
            </Select>

            {{
                'metadata': <Metadata src={image?.url} setFilterProps={setFilterProps} id={id} />,
                'rotate': <Rotate src={image?.url} setFilterProps={setFilterProps} />,
            }[filter]}

            <Button
                onClick={async () => {
                    console.log(filterProps)
                    try {
                        await filterImage(id, filter, filterProps)
                    } catch (error) {
                        console.log(error)
                    }
                }}
            >
                save
            </Button>
        </Flex>
    )
}

const Metadata = ({ src, setFilterProps, id }) => {
    const [metadata, setMetadata] = useState(null)

    useEffect(() => {
        setFilterProps({})

        ;(async () => {
            try {
                setMetadata(await getImageMetadata(id))
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    return (
        <Flex
            w='100%'
            flexDir='column'
            gap={2}
        >
            <ChakraImage
                src={src}
                borderRadius="md"
                fit="cover"
            />

            {metadata && Object.entries(metadata).map(([key, value]) => (
                <span key={key}>{key}: {value || '-'}<br /></span>
            ))}
        </Flex>
    )
}

const Rotate = ({ src, setFilterProps }) => {
    const [angle, setAngle] = useState(0)

    useEffect(() => setFilterProps({ angle }), [angle])

    return (
        <Flex
            w='100%'
            flexDir='column'
            gap={2}
        >
            <Box overflow="hidden">
                <ChakraImage
                    src={src}
                    borderRadius="md"
                    fit="cover"
                    transform={`rotate(${angle}deg)`}
                />
            </Box>

            <Slider
                onChange={setAngle}
                defaultValue={0}
                min={0}
                max={360}
                mt={8}
            >
                <SliderMark value={90}>
                  90
                </SliderMark>
                <SliderMark value={180}>
                  180
                </SliderMark>
                <SliderMark value={270}>
                  270
                </SliderMark>

                <SliderMark
                  value={angle}
                  textAlign='center'
                  mt='-10'
                  ml='-5'
                  w='12'
                >
                    {angle}
                </SliderMark>

                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>

                <SliderThumb />
            </Slider>
        </Flex>
    )
}

export default ViewImageWithFilters
