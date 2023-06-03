import { useUser } from '@clerk/nextjs'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { api } from '~/utils/api'
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function Post() {
  const router = useRouter()
  const {user} = useUser()
  const {data} = api.post.getPost.useQuery({id: router.query.post as string}, {enabled: router.isReady})
  const {data: allComments} = api.comment.getAllComment.useQuery()
  console.log(allComments)
  const mutation = api.comment.createComment.useMutation()

  const handleComment = (e: any) => {
    if(e.key != "Enter" || /^\s*$/.test(e.target.value)) return

    mutation.mutate({
      authorId: user?.id as string,
      postId: router.query.post as string,
      comment: e.target.value
    },
    {
      onSuccess: (data) => {
        e.target.value = ""
      }
    })
  }

  return (
    <main className="max-w-[1200px] mx-auto p-6">
      <button onClick={() => router.back()}>Go Back</button>
      <div className="w-full h-[500px] relative my-4">
        <Image src={data?.image ?? ""} className="rounded-md" placeholder='blur' blurDataURL='https://via.placeholder.com/1280x500' fill alt={'banner'} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl">{data?.title}</h1>
        <h1>{dayjs(data?.createdAt).fromNow()}</h1>
      </div>
      <p className="text-lg text-gray-300 my-4">{data?.description}</p>
      <h3 className="text-xl mt-20">Comments</h3>
      {
        allComments?.map(el => (
          <div className='bg-[#303134] rounded-md my-4 text-[#bdc1c6] p-2' key={el.id}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg">{el.authorId}</h4>
              <h1>{dayjs(el.createdAt).fromNow()}</h1>
            </div>
            <p>{el.comment}</p>
          </div>
        ))
      }
      <div className="flex items-center my-6">
        <Image src={user?.profileImageUrl ?? ""} alt="image" className='rounded-full mr-2' width={45} height={45} />
        <input type="text" placeholder='Comment...' className='bg-inherit w-full rounded-md p-2 border border-gray-500 outline-none' onKeyDown={handleComment} />
      </div>
    </main>
  )
}

export default Post