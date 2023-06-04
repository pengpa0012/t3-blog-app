import { useUser } from '@clerk/nextjs'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { api } from '~/utils/api'
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type FormValues = {
  title: string
  image: File
  description: string
};

function Profile() {
  const router = useRouter()
  const [tab, setTab] = useState(0)
  const {user} = useUser()
  const { register, handleSubmit, reset } = useForm<FormValues>()
  const { data } = api.post.getUserPosts.useQuery({authorId: router.query.profile as string}, {enabled: router.isReady})
  const mutation = api.post.createPost.useMutation()

  const onSubmit = (data: FormValues) => {
    mutation.mutateAsync({
      title: data.title,
      description: data.description,
      authorId: user?.id ?? "",
      image: "https://via.placeholder.com/1280x500"
    })
    .catch(console.error)
    .finally(() => reset())
  }
  

  return (
    <main className="max-w-[1200px] mx-auto p-6">
      <button onClick={() => router.back()}>Go Back</button>
      <div className='bg-[#303134] p-8 rounded-md mt-12 flex flex-col items-center'>
        <Image src={user?.profileImageUrl ?? ""} alt="image" className='rounded-full mb-4' width={200} height={200} />
        <h1 className="text-3xl">{user?.fullName}</h1>
      </div>
      <ul className="flex my-4 gap-2">
        <li className={`text-[#bdc1c6] cursor-pointer p-3 rounded-md ${tab == 0 ? "text-white bg-white/10" : ""}`} onClick={() => setTab(0)}>Create Post</li>
        <li className={`text-[#bdc1c6] cursor-pointer p-3 rounded-md ${tab == 1 ? "text-white bg-white/10" : ""}`} onClick={() => setTab(1)}>My Posts</li>
      </ul>
      {
        tab == 0 ?
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="border border-dashed border-gray-500 relative grid place-items-center rounded-md mb-2">
              <input type="file" {...register("image")} className="cursor-pointer relative block opacity-0 w-full h-full p-20 z-50" onChange={(e) => console.log(e)} />
              <div className="text-center absolute top-50 right-0 left-0 m-auto">
                <p className="">Upload Image</p>
              </div>
            </div>
            <input type="text" {...register("title")} placeholder='Title...' className='border border-gray-500 rounded-md bg-inherit w-full my-2 text-md p-2 outline-none' />
            <textarea placeholder='Description' {...register("description")} className='border border-gray-500 rounded-md bg-inherit w-full my-2 text-md p-2 outline-none min-h-[300px] resize-none'></textarea>
            <button className='w-full rounded-md outline-none bg-blue-400 text-white py-3 text-lg'>Post</button>
          </form>
        : 
        data?.map(el => (
          <div className='bg-[#303134] rounded-md my-2 text-[#bdc1c6] p-2 w-full' key={el.id}>
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-md">{el.title}</h4>
              <p className='text-sm'>{dayjs(el.createdAt).fromNow()}</p>
            </div>
            <p className='text-sm'>{el.description}</p>
          </div>
        ))
        
      }
      
    </main>
  )
}

export default Profile