import React, { useState, useEffect } from 'react'
import { Box, Checkbox, Flex, Heading, Stack, Button } from '@chakra-ui/react'
import { useDropzone } from 'react-dropzone'

import { uploadImages } from './api'

const Upload = () => {
    const {
        getRootProps,
        getInputProps,
        acceptedFiles,
        fileRejections,
    } = useDropzone({
        multiple: true,
        accept: {
            "image/*": [],
        },
    })
    const [files, setFiles] = useState([])
    const [checked, setChecked] = useState([])

    useEffect(() => {
        const allFiles = [...files, ...acceptedFiles]
        setFiles(allFiles)

        const newChecked = [...checked, ...acceptedFiles.map(() => true)]
        setChecked(newChecked)
    }, [acceptedFiles])

    useEffect(() => {
        fileRejections.map(({ file, errors }) => (
            console.log(file, errors)
        ))
    }, [fileRejections])

    return (
        <Flex
            direction="column"
            gap="4"
            m="4"
        >
            <Box
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                p="4"
                h="200px"
            >
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    {...getRootProps({ className: 'dropzone' })}
                >
                    <input {...getInputProps()} />
                    <p>drag 'n' drop images, or click to select</p>
                </div>
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
