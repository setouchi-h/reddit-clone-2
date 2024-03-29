import { Community, communityState } from "@/src/atoms/communitiesAtom"
import About from "@/src/components/Community/About"
import CommunityNotFound from "@/src/components/Community/CommunityNotFound"
import CreatePostLink from "@/src/components/Community/CreatePostLink"
import Header from "@/src/components/Community/Header"
import PageContent from "@/src/components/Layout/PageContent"
import Posts from "@/src/components/Posts/Posts"
import { firestore } from "@/src/firebase/clientApp"
import usePosts from "@/src/hooks/usePosts"
import { doc, getDoc } from "firebase/firestore"
import { GetServerSidePropsContext } from "next"
import { useEffect } from "react"
import { useSetRecoilState } from "recoil"
import safeJsonStringify from "safe-json-stringify"

type CommunityPageProps = {
  communityData: Community
}

const ComunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  const setCommunityStateValue = useSetRecoilState(communityState)
  // const { postStateValue } = usePosts()

  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityData])

  if (!communityData) {
    return <CommunityNotFound />
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About communityData={communityData} />
        </>
      </PageContent>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get community data and pass it to client
  try {
    const communityDocRef = doc(firestore, "communities", context.query.communityId as string)
    const communityDoc = await getDoc(communityDocRef)

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }))
          : "",
      },
    }
  } catch (error) {
    console.log("getServerSideProps error:", error)
    return {
      props: {},
    }
  }
}

export default ComunityPage
