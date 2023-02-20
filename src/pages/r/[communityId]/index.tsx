import { Community } from "@/src/atoms/communitiesAtom"
import { firestore } from "@/src/firebase/clientApp"
import { doc, getDoc } from "firebase/firestore"
import { GetServerSidePropsContext } from "next"
import safeJsonStringify from "safe-json-stringify"

type CommunityPageProps = {
  communityData: Community
}

const ComunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  return <div>WELCOME TO {communityData.id}</div>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    console.log("aaa")
  // get community data and pass it to client
  try {
    const communityDocRef = doc(firestore, "communities", context.query.communityId as string)
    const communityDoc = await getDoc(communityDocRef)

    return {
      props: {
        communityData: JSON.parse(
          safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
        ),
      },
    }
  } catch (error) {
    console.log("getServerSideProps error", error)
  }
}

export default ComunityPage
