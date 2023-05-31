import { Flex } from '@chakra-ui/react'

import Profile from './Profile.jsx'
import Album from '../images/Album.jsx'

const User = ({ id }) => {
    return (
        <Flex
            direction="column"
            width="100%"
            height="100%"
            overflow="auto"
            gap={4}
            p={4}
        >
            <Profile id={id} />

            <Album id={id} />
        </Flex>
    )
}

export default User
