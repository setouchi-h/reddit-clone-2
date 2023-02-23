import { Community } from "@/src/atoms/communitiesAtom"
import CommunityNotFound from "@/src/components/Community/CommunityNotFound"
import CreatePostLink from "@/src/components/Community/CreatePostLink"
import Header from "@/src/components/Community/Header"
import PageContent from "@/src/components/Layout/PageContent"
import Posts from "@/src/components/Posts/Posts"
import { firestore } from "@/src/firebase/clientApp"
import { doc, getDoc } from "firebase/firestore"
import { GetServerSidePropsContext } from "next"
import safeJsonStringify from "safe-json-stringify"

type CommunityPageProps = {
  communityData: Community
}

const ComunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
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
          <div>RHS</div>
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
    console.log("getServerSideProps error", error)
  }
}

export default ComunityPage