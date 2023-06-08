import { UserButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
// import { useState } from "react";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Loader } from "~/components/Loader";
import { PostBox } from "~/components/PostBox";
dayjs.extend(relativeTime);

const Home: NextPage = () => {
  const { user, isLoaded } = useUser()
  // const [tab, setTab] = useState(0)
  const router = useRouter()
  // const {data} = api.example.getPost.useQuery({id: "clid70vwx00009e400lifop3z"})
  const {data: allPost, isLoading} = api.post.getAllPost.useQuery()
  const {data: allComments} = api.comment.getAllComments.useQuery()

  console.log(allComments)
  return (
    <>
      <Head>
        <title>T3 Blog App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-[1200px] mx-auto p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">T3 Blog App</h1>
          {isLoaded ? <div className="flex items-center gap-2">
            <h1 className="text-md" onClick={() => router.push(`/profile/${user?.id || ""}`)}>{user?.firstName}</h1>
            <UserButton afterSignOutUrl="/"/>
          </div> : <Loader />}
        </div>
        <ul className="flex mt-12 gap-2">
          {/* <li className={`text-[#bdc1c6] cursor-pointer p-3 rounded-md ${tab == 0 ? "text-white bg-white/10" : ""}`} onClick={() => setTab(0)}>For You</li>
          <li className={`text-[#bdc1c6] cursor-pointer p-3 rounded-md ${tab == 1 ? "text-white bg-white/10" : ""}`} onClick={() => setTab(1)}>Following</li> */}
          <li className={`text-[#bdc1c6] text-2xl rounded-md`}>My Feed</li>
        </ul>
          {
            isLoading ?
              <Loader />
            :
            <div className="grid grid-cols-1 gap-4 my-4">
              {
                allPost?.posts.map(el => (
                  <PostBox users={allPost.users} post={el} onClick={() => router.push(`/post/${el.id || ""}`)} key={el.id} />
                ))
              }
            </div>
          }
      </main>
    </>
  );
};

export default Home;