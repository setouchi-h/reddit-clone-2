import { communityState } from "@/src/atoms/communitiesAtom"
import About from "@/src/components/Community/About"
import PageContent from "@/src/components/Layout/PageContent"
import NewPostForm from "@/src/components/Posts/NewPostForm"
import { auth } from "@/src/firebase/clientApp"
import useCommunityData from "@/src/hooks/useCommunityData"
import { Box, Text } from "@chakra-ui/react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRecoilValue } from "recoil"

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth)
  // const communityStateValue = useRecoilValue(communityState)
  const { communityStateValue } = useCommunityData()

  return (
    <PageContent>
      {/* NEw Post From */}
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>Create a post</Text>
        </Box>
        {user && (
          <NewPostForm
            user={user}
            communityImageURL={communityStateValue.currentCommunity?.imageURL}
          />
        )}
      </>

      {/* About */}
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  )
}
export default SubmitPostPage
