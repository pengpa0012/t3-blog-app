import { useUser } from '@clerk/nextjs'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { api } from '~/utils/api'
import relativeTime from "dayjs/plugin/relativeTime";
import { Loader } from '~/components/Loader'
import Notiflix from 'notiflix'
dayjs.extend(relativeTime);

function Post() {
  const router = useRouter()
  const {user, isLoaded} = useUser()
  const {data, isLoading: postLoading} = api.post.getPost.useQuery({id: router.query.post as string}, {enabled: router.isReady})
  const {data: allComments, refetch, isLoading: commentLoading} = api.comment.getAllComment.useQuery({postId: router.query.post as string}, {enabled: router.isReady})
  const [text, setText] = useState("")
  const mutation = api.comment.createComment.useMutation()

 
  
  const handleComment = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key != "Enter" || /^\s*$/.test(text)) return
    
    mutation.mutate({
      authorId: user?.id as string,
      postId: router.query.post as string,
      comment: text
    },
    {
      onSettled: () => {
        setText("")
        refetch().catch((err) => Notiflix.Notify.failure(err.message))
        Notiflix.Notify.success('Comment Created!')
      },
      onError: (err) => Notiflix.Notify.failure(err.message)
    })
  }

  return (
    <main className="max-w-[1200px] mx-auto p-6">
      <button onClick={() => router.back()}>Go Back</button>
      {postLoading ? <Loader />
        : <>
          <div className="w-full h-[500px] relative my-4">
            <Image src={data?.result?.image ?? ""} className="rounded-md object-cover" placeholder='blur' blurDataURL='https://via.placeholder.com/1280x500' fill alt={'banner'} />
          </div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl break-all">{data?.result?.title}</h1>
            <p>{dayjs(data?.result?.createdAt).fromNow()}</p>
          </div>
          <p className="text-lg text-gray-300">{data?.users[0]?.name}</p>
          <p className="text-lg text-gray-300 my-4 break-all">{data?.result?.description}</p>
        </>
      }
      <h3 className="text-xl mt-20">Comments</h3>
      <div className='scroll-comment max-h-[400px] overflow-y-scroll px-2'>
        {
          commentLoading ? <Loader />
          : allComments?.result.map(el => (
            <div className='flex items-center' key={el.id}>
              <Image src={allComments.users.find(user => user.id == el.authorId)?.image ?? ""} alt="image" className='rounded-full mr-2' width={45} height={45} />
              <div className='bg-[#303134] rounded-md my-2 text-[#bdc1c6] p-2 w-full' key={el.id}>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-md">{allComments.users.find(user => user.id == el.authorId)?.name}</h4>
                  <p className='text-sm'>{dayjs(el.createdAt).fromNow()}</p>
                </div>
                <p className='text-sm break-all'>{el.comment}</p>
              </div>
            </div>
          ))
        }
      </div>
     {isLoaded ? 
        <div className="flex items-center my-6">
          <Image src={user?.profileImageUrl ?? ""} alt="image" className='rounded-full mr-2' width={45} height={45} />
          <input type="text" onChange={(e) => setText(e.target.value)} value={text} placeholder='Comment...' className='bg-inherit w-full rounded-md p-2 border border-gray-500 outline-none' onKeyDown={handleComment} />
        </div>
        : <Loader />
      }
    </main>
  )
}

export default Post