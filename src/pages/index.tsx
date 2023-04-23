import { Stack } from "@chakra-ui/react"
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import type { NextPage } from "next"
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRecoilValue } from "recoil"
import { communityState } from "../atoms/communitiesAtom"
import { Post, PostVote } from "../atoms/postsAtom"
import CreatePostLink from "../components/Community/CreatePostLink"
import PersonalHome from "../components/Community/PersonalHome"
import Premium from "../components/Community/Premium"
import Recommendations from "../components/Community/Recommendations"
import PageContent from "../components/Layout/PageContent"
import PostItem from "../components/Posts/PostItem"
import PostLoader from "../components/Posts/PostLoader"
import { auth, firestore } from "../firebase/clientApp"
import useCommunityData from "../hooks/useCommunityData"
import usePosts from "../hooks/usePosts"

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth) // userが取得されるまで時間がかかる、取得中はloadingUserがtrueになる
  const [loading, setLoading] = useState(false)
  const { postStateValue, setPostStateValue, onSelectPost, onDeletePost, onVote } = usePosts()
  const { communityStateValue } = useCommunityData()

  const buildUserHomeFeed = async () => {
    // fetch some posts from each community that the user is in
    setLoading(true)
    try {
      if (communityStateValue.mySnippets.length) {
        // get posts from users' communities
        const myCommunityIds = communityStateValue.mySnippets.map((snippet) => snippet.communityId)
        const postQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunityIds),
          limit(10)
        )
        const postDocs = await getDocs(postQuery)
        const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }))
      } else {
        buildNoUserHomeFeed()
      }
    } catch (error) {
      console.log("buildUserHomeFeed: ", error)
    }
    setLoading(false)
  }

  const buildNoUserHomeFeed = async () => {
    setLoading(true)
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      )
      const postDocs = await getDocs(postQuery)
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }))
    } catch (error) {
      console.log("buildNoUserHomeFeed: ", error)
    }
    setLoading(false)
  }

  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map((post) => post.id)
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      )
      const postVoteDocs = await getDocs(postVotesQuery)
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }))
    } catch (error) {
      console.log("getUserPostVotes: ", error)
    }
  }

  // useEffects
  useEffect(() => {
    if (communityStateValue.snippetsFetched) buildUserHomeFeed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityStateValue.snippetsFetched])

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loadingUser])

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes()

    // clean up func
    /// run when dismount
    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, postStateValue.posts])

  return (
    <PageContent>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                onVote={onVote}
                userVoteValue={
                  postStateValue.postVotes.find((item) => item.postId === post.id)?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <Stack spacing={5}>
        <Recommendations />
        <Premium />
        <PersonalHome />
      </Stack>
    </PageContent>
  )
}

export default Home
