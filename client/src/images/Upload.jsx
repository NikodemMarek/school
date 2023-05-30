import React, { useState } from 'react'
import { Checkbox, Flex, Heading, Stack, Button, Box } from '@chakra-ui/react'

import { uploadImages } from './api'
import Dropzone from './Dropzone'

const Upload = () => {
    const [files, setFiles] = useState([])
    const [checked, setChecked] = useState([])

    const addFiles = (newFiles) => {
        const allFiles = [...files, ...newFiles]
        setFiles(allFiles)

        const newChecked = [...checked, ...newFiles.map(() => true)]
        setChecked(newChecked)
    }

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

            <Button onClick={() => {
                const filesToUpload = files.filter((_, i) => checked[i])

                try {
                    uploadImages('add', filesToUpload)
                } catch (err) {
                    console.log(err)
                }
            }}>
                upload
            </Button>
        </Flex>
    )
}

export default Upload
