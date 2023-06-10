import { useUser } from '@clerk/nextjs'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { api } from '~/utils/api'
import relativeTime from "dayjs/plugin/relativeTime";
import { Loader } from '~/components/Loader'
import Notiflix from 'notiflix'
import { blurImage } from '~/utils/helper'
import { CommentBox } from '~/components/CommentBox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
dayjs.extend(relativeTime);

function Post() {
  const router = useRouter()
  const {user, isLoaded} = useUser()
  const {data, isLoading: postLoading} = api.post.getPost.useQuery({id: router.query.post as string}, {enabled: router.isReady})
  const {data: allComments, refetch, isLoading: commentLoading} = api.comment.getCommentByPost.useQuery({postId: router.query.post as string}, {enabled: router.isReady})
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
        refetch().catch((err: { message: string }) => Notiflix.Notify.failure(err.message))
        Notiflix.Notify.success('Comment Created!')
      },
      onError: (err) => Notiflix.Notify.failure(err.message)
    })
  }


  return (
    <main className="max-w-[1200px] mx-auto p-6">
      <button className='text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-2 rounded-md cursor-pointer flex items-center gap-2' onClick={() => router.back()}>
        <FontAwesomeIcon icon={faArrowLeft} className='w-4' />
        <span>Go Back</span>
      </button>
      {postLoading ? <Loader />
        : <>
          <div className="w-full min-h-[300px] bg-[#252525] rounded-md relative my-4">
            <Image src={data?.result?.image ?? ""} className="object-contain" placeholder="blur" blurDataURL={blurImage} fill alt={'banner'} />
          </div>
          <div className="my-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl break-all text-gray-200">{data?.result?.title}</h1>
              <p className='text-gray-300'>{dayjs(data?.result?.createdAt).format(`MMMM DD YYYY · h:mma`)}</p>
            </div>
            <div className="flex items-center mb-12">
              <Image src={data?.users[0]?.image ?? ""} alt="image" className='rounded-full mr-2' width={30} height={30} />
              <p className="text-sm text-gray-300">{data?.users[0]?.name}</p>
            </div>
            <p className="text-md text-gray-300 my-4 break-all whitespace-pre-line">{data?.result?.description}</p>
          </div>
        </>
      }
      <h3 className="text-xl mt-40 text-gray-300">Comments</h3>
      <div className='scroll-comment max-h-[400px] overflow-y-scroll px-2'>
        {
          commentLoading ? <Loader />
          : allComments?.result.map(el => (
            <CommentBox users={allComments.users} comment={el} key={el.id} />
          ))
        }
      </div>
     {isLoaded ? 
        <div className="flex items-center my-6">
          <Image src={user?.profileImageUrl ?? ""} alt="image" className='rounded-full mr-2' width={45} height={45} />
          <input type="text" onChange={(e) => setText(e.target.value)} value={text} placeholder='Comment...' className='bg-inherit w-full rounded-md p-2 border border-gray-500 outline-none text-gray-300' onKeyDown={handleComment} />
        </div>
        : <Loader />
      }
    </main>
  )
}

export default Post