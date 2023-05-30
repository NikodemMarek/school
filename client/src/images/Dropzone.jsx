import React, { useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Box, useToast } from '@chakra-ui/react'

const Dropzone = ({ children, multiple, setAccepted }) => {
    const toast = useToast()

    const {
        getRootProps,
        getInputProps,
        acceptedFiles,
        fileRejections,
    } = useDropzone({
        multiple,
        accept: {
            "image/*": [],
        },
    })

    useEffect(() => {
        for (const file of fileRejections) {
            console.log(file)

            toast({
                title: `file ${file.name} could not be uploaded`,
                status: "error",
                isClosable: true,
            })
        }
    }, [fileRejections])

    useEffect(() => setAccepted(acceptedFiles), [acceptedFiles])

    return (
        <Box
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            p="4"
            h="100%"
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
                {children ?? <p>drag 'n' drop images, or click to select</p>}
            </div>
        </Box>
    )
}

export default Dropzone
