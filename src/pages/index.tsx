import { UserButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { user } = useUser()
  const [tab, setTab] = useState(0)
  const router = useRouter()
  // const {data} = api.example.getPost.useQuery({id: "clid70vwx00009e400lifop3z"})
  const {data: allPost, isLoading} = api.example.getAllPost.useQuery()

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-[1200px] mx-auto p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">T3 Blog App</h1>
          <div className="flex items-center gap-2">
            <h1 className="text-md" onClick={() => router.push(`/profile/${user?.id || ""}`)}>{user?.firstName}</h1>
            <UserButton afterSignOutUrl="/"/>
          </div>
        </div>
        <ul className="flex mt-12 gap-2">
          <li className={`text-[#bdc1c6] cursor-pointer p-3 rounded-md ${tab == 0 ? "text-white bg-white/10" : ""}`} onClick={() => setTab(0)}>For You</li>
          <li className={`text-[#bdc1c6] cursor-pointer p-3 rounded-md ${tab == 1 ? "text-white bg-white/10" : ""}`} onClick={() => setTab(1)}>Following</li>
        </ul>
        {
          isLoading ? 
          <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 mx-auto text-gray-200 my-20 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
          :
          tab == 0 ?
          allPost?.map(el => (
            <div className={`p-4 bg-[#303134] rounded-md my-4 text-[#bdc1c6]`} key={el.id} onClick={() => router.push(`/post/${el.id || ""}`)}>
              <h1>{el.title}</h1>
              <p>{el.description}</p>
            </div>
          ))
          :
          allPost?.map(el => (
            <div className={`p-4 bg-[#303134] rounded-md my-4 text-[#bdc1c6]`} key={el.id} onClick={() => router.push(`/post/${el.id || ""}`)}>
              <h1>{el.title}</h1>
              <p>{el.description}</p>
            </div>
          ))
        }
      </main>
    </>
  );
};

export default Home;