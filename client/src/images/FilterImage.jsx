import { useState, useEffect } from "react"
import { Flex, Select, Image as ChakraImage, Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark, Box, Button, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react"

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
                <option value={'resize'}>resize</option>
                <option value={'crop'}>crop</option>
                <option value={'grayscale'}>grayscale</option>
                <option value={'negate'}>negate</option>
                <option value={'flip'}>flip</option>
                <option value={'flop'}>flop</option>
                <option value={'tint'}>tint</option>
            </Select>

            {{
                'metadata': <Metadata src={image?.url} setFilterProps={setFilterProps} id={id} />,
                'rotate': <Rotate src={image?.url} setFilterProps={setFilterProps} />,
                'resize': <Resize src={image?.url} setFilterProps={setFilterProps} id={id} />,
                'crop': <Crop src={image?.url} setFilterProps={setFilterProps} id={id} />,
                'grayscale': <Filter src={image?.url} setFilterProps={setFilterProps} id={id} filter={"grayscale(100%)"} />,
                'negate': <Filter src={image?.url} setFilterProps={setFilterProps} filter={"invert(1)"} />,
                'flip': <Transform src={image?.url} setFilterProps={setFilterProps} transform={"scaleY(-1)"} />,
                'flop': <Transform src={image?.url} setFilterProps={setFilterProps} transform={"scaleX(-1)"} />,
                'tint': <Tint src={image?.url} setFilterProps={setFilterProps} />,
            }[filter]}

            <Button
                onClick={async () => {
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

const Resize = ({ src, setFilterProps, id }) => {
    const [width, setWidth] = useState(50)
    const [height, setHeight] = useState(50)

    useEffect(() => {
        ;(async () => {
            try {
                const { width, height } = await getImageMetadata(id)
                setWidth(width)
                setHeight(height)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    useEffect(() => setFilterProps({ width, height }), [width, height])

    return (
        <Flex
            w='100%'
            flexDir='column'
            gap={2}
        >
            <Box
                overflow="hidden"
                minW="400px"
                minH="400px"
                padding="auto"
            >
                <ChakraImage
                    src={src}
                    borderRadius="md"
                    width={`${width}px`}
                    height={`${height}px`}
                />
            </Box>

            <Flex w='100%' gap={4}>
                <NumberInput
                    min={0}
                    max={4000}
                    value={width}
                    onChange={setWidth}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <NumberInput
                    min={0}
                    max={4000}
                    value={height}
                    onChange={setHeight}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
            </Flex>
        </Flex>
    )
}

// TODO: reformat?

const Crop = ({ src, setFilterProps, id }) => {
    const [width, setWidth] = useState(50)
    const [height, setHeight] = useState(50)
    const [left, setLeft] = useState(0)
    const [top, setTop] = useState(0)

    useEffect(() => {
        ;(async () => {
            try {
                const { width, height } = await getImageMetadata(id)
                setWidth(width)
                setHeight(height)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    useEffect(() => setFilterProps({ width, height, left, top }), [width, height, left, top])

    return (
        <Flex
            w='100%'
            h='100%'
            flexDir='column'
            gap={2}
        >
            <Box
                overflow="hidden"
                padding="auto"
                position="relative"
            >
                <ChakraImage
                    src={src}
                    borderRadius="md"
                    fit="cover"
                />

                <Box
                    position="absolute"
                    top={`${top}px`}
                    left={`${left}px`}
                    width={`${width}px`}
                    height={`${height}px`}
                    border="2px dashed"
                />
            </Box>

            <Flex w='100%' gap={4}>
                <NumberInput
                    min={0}
                    max={4000}
                    value={width}
                    onChange={setWidth}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <NumberInput
                    min={0}
                    max={4000}
                    value={height}
                    onChange={setHeight}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
            </Flex>

            <Flex w='100%' gap={4}>
                <NumberInput
                    min={0}
                    max={4000}
                    value={left}
                    onChange={setLeft}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <NumberInput
                    min={0}
                    max={4000}
                    value={top}
                    onChange={setTop}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
            </Flex>
        </Flex>
    )
}

const Filter = ({ src, setFilterProps, filter }) => {
    useEffect(() => setFilterProps({ }), [])

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
                filter={filter}
            />
        </Flex>
    )
}

const Transform = ({ src, setFilterProps, transform }) => {
    useEffect(() => setFilterProps({ }), [])

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
                transform={transform}
            />
        </Flex>
    )
}

const Tint = ({ src, setFilterProps }) => {
    const [r, setR] = useState(0)
    const [g, setG] = useState(0)
    const [b, setB] = useState(0)

    useEffect(() => setFilterProps({ r, g, b }), [r, g, b])

    return (
        <Flex
            w='100%'
            flexDir='column'
            gap={2}
        >
            <ChakraImage
                src={src}
                borderRadius="md"
            />

            <Flex w='100%' gap={4}>
                <NumberInput
                    min={0}
                    max={255}
                    value={r}
                    onChange={setR}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <NumberInput
                    min={0}
                    max={255}
                    value={g}
                    onChange={setG}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <NumberInput
                    min={0}
                    max={255}
                    value={b}
                    onChange={setB}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
            </Flex>
        </Flex>
    )
}

export default ViewImageWithFilters
