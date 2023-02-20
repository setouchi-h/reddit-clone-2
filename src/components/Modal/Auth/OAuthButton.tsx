import { auth, firestore } from "@/src/firebase/clientApp"
import { Button, Flex, Image, Text } from "@chakra-ui/react"
import { User } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useSignInWithGoogle } from "react-firebase-hooks/auth"
import { useEffect } from "react"

const OAuthButton: React.FC = () => {
  const [signInWithGoogle, userCred, loading, error] = useSignInWithGoogle(auth)

  const createUserDocDocument = async (user: User) => {
    const userDocRef = doc(firestore, "users", user.uid)
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)))
  }

  useEffect(() => {
    if (userCred) {
      createUserDocDocument(userCred.user)
    }
  }, [userCred])

  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button variant="oauth" mb={2} isLoading={loading} onClick={() => signInWithGoogle()}>
        <Image src="/images/googlelogo.png" height="20px" mr={4} alt="" />
        Continue with Google
      </Button>
      <Button variant="oauth">Some Other Provider</Button>
      {error && <Text>{error.message}</Text>}
    </Flex>
  )
}
export default OAuthButton
