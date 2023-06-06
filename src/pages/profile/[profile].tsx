import { useUser } from '@clerk/nextjs'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { api } from '~/utils/api'
import relativeTime from "dayjs/plugin/relativeTime";
import { bytesToSize } from '~/utils/helper'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '~/utils/firebase'
import { v4 } from "uuid";
import { Loader } from '~/components/Loader'
import Notiflix from 'notiflix'
dayjs.extend(relativeTime);

type FormValues = {
  title: string
  image: File
  description: string
};

function Profile() {
  const router = useRouter()
  const [tab, setTab] = useState(0)
  const {user, isLoaded} = useUser()
  const [image, setImage] = useState<File | null>()
  const [previewIMG, setPreviewIMG] = useState("")
  const { register, handleSubmit, reset } = useForm<FormValues>()
  const { data } = api.post.getUserPosts.useQuery({authorId: router.query.profile as string}, {enabled: router.isReady})
  const mutation = api.post.createPost.useMutation()
  const imgTypes = ["jpeg", "jpg", "png", "webp"]

  const onSubmit = (data: FormValues) => {
    if(!image) return Notiflix.Notify.warning("add image")
    if(!data.title) return Notiflix.Notify.warning("add title")
    if(!imgTypes.includes(image?.name.split(".").at(-1) as string)) return Notiflix.Notify.warning("upload the correct file type: (jpg, jpeg, png)")
    if(bytesToSize(image.size).includes("MB")) return Notiflix.Notify.warning("Image size must be under 1MB")

    const imageRef = ref(storage, `${image?.name + v4()}`);
    uploadBytes(imageRef, image).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then((url) => {
        mutation.mutateAsync({
          title: data.title,
          description: data.description,
          authorId: user?.id ?? "",
          image: url ?? "https://via.placeholder.com/1280x500"
        })
        .then(() => {
          Notiflix.Notify.success('Post Created!')
          setPreviewIMG("")
          setImage(undefined)
          reset()
        })
        .catch((err: { message: string }) => Notiflix.Notify.failure(err.message))
      });
    }).catch((err) => Notiflix.Notify.failure(err as string))
   
  }

  const onChangeProfile = (file: File | undefined) => {
    if(file) {
      const blob = window.URL.createObjectURL(file)
      setPreviewIMG(blob)
      setImage(file)
    }
  }

  console.log(image)
  return (
    <main className="max-w-[1200px] mx-auto p-6">
      <button onClick={() => router.back()}>Go Back</button>
      <div className='bg-[#303134] p-8 rounded-md mt-12 flex flex-col items-center'>
        {
          isLoaded ?
          <>
            <Image src={user?.profileImageUrl ?? ""} alt="image" className='rounded-full mb-4' width={200} height={200} />
            <h1 className="text-3xl">{user?.fullName}</h1>
          </>
          : <Loader />
        }
      </div>
      <ul className="flex my-4 gap-2">
        <li className={`text-[#bdc1c6] cursor-pointer p-3 rounded-md ${tab == 0 ? "text-white bg-white/10" : ""}`} onClick={() => setTab(0)}>Create Post</li>
        <li className={`text-[#bdc1c6] cursor-pointer p-3 rounded-md ${tab == 1 ? "text-white bg-white/10" : ""}`} onClick={() => setTab(1)}>My Posts</li>
      </ul>
      {
        tab == 0 ?
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="border border-dashed border-gray-500 relative grid place-items-center rounded-md mb-2">
              {previewIMG && 
              <div className='w-full min-h-[300px]'>
                <div className='absolute cursor-pointer right-[-10px] top-[-10px] bg-red-500 h-[30px] w-[30px] grid place-items-center z-[60] rounded-full' onClick={() => {
                  setPreviewIMG("")
                  setImage(undefined)
                }}>
                  <span>x</span>
                </div>
                <Image src={previewIMG ?? ""} fill alt={'banner'} className='object-contain rounded-md' />
              </div>}
              {
                !previewIMG &&
                <>
                  <input type="file" {...register("image")} className="cursor-pointer relative block opacity-0 w-full h-[400px] z-50" 
                  onChange={(e) => onChangeProfile(e.target.files![0])} />
                  <div className="text-center absolute top-50 right-0 left-0 m-auto">
                    <p className="">Upload Image</p>
                  </div>
                </>
              }
            </div>
            <input type="text" {...register("title")} placeholder='Title...' className='border border-gray-500 rounded-md bg-inherit w-full my-2 text-md p-2 outline-none' />
            <textarea minLength={100} maxLength={2000} placeholder='Description' {...register("description")} className='border border-gray-500 rounded-md bg-inherit w-full my-2 text-md p-2 outline-none min-h-[300px] resize-none'></textarea>
            <button className='w-full rounded-md outline-none bg-blue-400 text-white py-3 text-lg'>Post</button>
          </form>
        : 
        data?.map(el => (
          <div className='bg-[#303134] rounded-md my-2 text-[#bdc1c6] p-2 w-full' key={el.id}>
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-md">{el.title}</h4>
              <p className='text-sm'>{dayjs(el.createdAt).fromNow()}</p>
            </div>
            <p className='text-sm break-all'>{el.description}</p>
          </div>
        ))
        
      }
      
    </main>
  )
}

export default Profile