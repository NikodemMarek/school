import React, { useState } from 'react'
import { Checkbox, Flex, Heading, Stack, Button, Box, useBoolean, Spinner } from '@chakra-ui/react'

import { uploadImages } from './api'
import Dropzone from './Dropzone'

const Upload = ({ onUpload }) => {
    const [files, setFiles] = useState([])
    const [checked, setChecked] = useState([])

    const [isUploading, setIsUploading] = useBoolean(false)

    const addFiles = (newFiles) => {
        const allFiles = [...files, ...newFiles]
        setFiles(allFiles)

        const newChecked = [...checked, ...newFiles.map(() => true)]
        setChecked(newChecked)
    }

    if (isUploading)
        return (
            <Flex
                align="center"
                justify="center"
                h="100%"
            >
                <Spinner size="xl" />
            </Flex>
        )

    return (
        <Flex
            direction="column"
            gap="4"
            m="4"
        >
            <Box h="200px">
                <Dropzone
                    multiple={true}
                    setAccepted={addFiles}
                />
            </Box>

            { files.length > 0 && (<>
                <Heading as="h3" size="md">accepted files</Heading>
                <Stack>
                    {files.map(({ path, size }, i) => (
                        <Checkbox
                            isChecked={checked[i]}
                            onChange={(e) => {
                                const newChecked = [...checked]
                                newChecked[i] = e.target.checked
                                setChecked(newChecked)
                            }}
                            key={i}
                        >
                            {path} - {size} bytes
                        </Checkbox>
                    ))}
                </Stack>
            </>)}

            <Button onClick={async () => {
                const filesToUpload = files.filter((_, i) => checked[i])

                setIsUploading.on()

                try {
                    await uploadImages(filesToUpload)
                } catch (err) {
                    console.log(err)
                }

                setIsUploading.off()

                onUpload()
            }}>
                upload
            </Button>
        </Flex>
    )
}

export default Upload
