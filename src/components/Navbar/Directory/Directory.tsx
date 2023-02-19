import { ChevronDownIcon } from "@chakra-ui/icons"
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  MenuDivider,
  Text,
} from "@chakra-ui/react"
import { signOut, User } from "firebase/auth"
import { FaRedditSquare } from "react-icons/fa"
import { VscAccount } from "react-icons/vsc"
import { IoSparkles } from "react-icons/io5"
import { CgProfile } from "react-icons/cg"
import { MdOutlineLogin } from "react-icons/md"
import { auth } from "@/src/firebase/clientApp"
import { useSetRecoilState } from "recoil"
import { authModalState } from "@/src/atoms/authModalAtom"

type UserMenuProps = {
  user?: User | null
}

const Directory: React.FC<UserMenuProps> = ({ user }) => {
  const setAuthModalState = useSetRecoilState(authModalState)

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
      >
        <Flex align="center">
          <Flex align="center">
            {user ? (
              <>
                <Icon as={FaRedditSquare} fontSize={24} mr={1} color="gray.300" />
                <Flex
                  direction="column"
                  display={{ base: "none", lg: "flex" }}
                  fontSize="8pt"
                  align="flex-start"
                  mr={8}
                >
                  <Text fontWeight={700}>{user?.displayName || user.email?.split("@")[0]}</Text>
                  <Flex>
                    <Icon as={IoSparkles} color="brand.100" mr={1} />
                    <Text color="gray.400">1 karma</Text>
                  </Flex>
                </Flex>
              </>
            ) : (
              <Icon fontSize={24} color="gray.400" mr={1} as={VscAccount} />
            )}
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        
      </MenuList>
    </Menu>
  )
}
export default Directory
