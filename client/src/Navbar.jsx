import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react'

import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const Navbar = ({ children, active }) => {
    const navigate = useNavigate()

    const items = [
        {
            name: 'home',
            path: '/',
            icon: <HomeOutlinedIcon />,
            activeIcon: <HomeIcon />,
        },
        {
            name: 'profile',
            path: '/users/me',
            icon: <AccountCircleOutlinedIcon />,
            activeIcon: <AccountCircleIcon />,
        },
    ]

    return (
        <Flex
            direction="row"
            height="100vh"
            width="100vw"
        >
            <Flex
                direction="column"
                padding={4}
                gap={4}
            >
                {items.map((item, i) => (
                    <Box
                        key={item.name}
                        color={active === i ? 'blue.500' : 'gray.500'}
                        _hover={{
                            color: 'blue.500',
                        }}
                        cursor="pointer"
                        onClick={() => navigate(item.path)}
                    >
                        {active === i ? item.activeIcon : item.icon}
                    </Box>
                ))}
            </Flex>

            <Flex
                overflow="auto"
                width="100%"
                height="100%"
                padding={4}
                boxSizing="border-box"
            >
                {children}
            </Flex>
        </Flex>
    )
}

export default Navbar
