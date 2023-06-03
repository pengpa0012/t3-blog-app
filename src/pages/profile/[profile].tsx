import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { api } from '~/utils/api'
// import { api } from '~/utils/api'

function Profile() {
  const router = useRouter()
  const [tab, setTab] = useState(0)
  const {user} = useUser()
  const { register, handleSubmit } = useForm()
  const mutation = api.post.createPost.useMutation()

  const onSubmit = (data: FieldValues) => {
    mutation.mutateAsync({
      title: data.title,
      description: data.description,
      authorId: user?.id ?? "",
      image: "https://via.placeholder.com/1280x500"
    })
    .then(data => console.log(data))
    .catch(console.error)
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
        [1,2,3,4,5].map(el => (
          <div className="p-4 bg-[#303134] rounded-md my-4 text-[#bdc1c6]" key={el} onClick={() => router.push(`/post/${el || ""}`)}>
            <h1>Title</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime pariatur deleniti quisquam dolor corporis, iusto hic dolorem. Ipsum, vero expedita.</p>
          </div>
        ))
        
      }
      
    </main>
  )
}

export default Profile