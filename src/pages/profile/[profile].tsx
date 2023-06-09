import { useUser } from '@clerk/nextjs'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { api } from '~/utils/api'
import relativeTime from "dayjs/plugin/relativeTime";
import { blurImage, bytesToSize } from '~/utils/helper'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '~/utils/firebase'
import { v4 } from "uuid";
import { Loader } from '~/components/Loader'
import Notiflix from 'notiflix'
import { PostBox } from '~/components/PostBox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
dayjs.extend(relativeTime);

type FormValues = {
  title: string
  image: File
  description: string
};

type allComment = {
  id: string;
  postId: string | null
}[]

function Profile() {
  const router = useRouter()
  const [tab, setTab] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const {user, isLoaded} = useUser()
  const [image, setImage] = useState<File | null>()
  const [previewIMG, setPreviewIMG] = useState("")
  const [modal, setModal] = useState(false)
  const [postID, setPostID] = useState("")
  const { register, handleSubmit, reset } = useForm<FormValues>()
  const { data, refetch } = api.post.getUserPosts.useQuery({authorId: router.query.profile as string}, {enabled: router.isReady})
  const createPost = api.post.createPost.useMutation()
  const deletePost = api.post.deletePost.useMutation()
  const imgTypes = ["jpeg", "jpg", "png", "webp"]
  const {data: allComments } = api.comment.getAllComments.useQuery()

  const onSubmit = (data: FormValues) => {
    if(!image) return Notiflix.Notify.warning("add image")
    if(!data.title) return Notiflix.Notify.warning("add title")
    if(!imgTypes.includes(image?.name.split(".").at(-1) as string)) return Notiflix.Notify.warning("upload the correct file type: (jpg, jpeg, png, webp)")
    if(bytesToSize(image.size).includes("MB")) return Notiflix.Notify.warning("Image size must be under 1MB")

    setIsLoading(true)
    const imageRef = ref(storage, `${image?.name + v4()}`);
    uploadBytes(imageRef, image).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then((url) => {
        createPost.mutateAsync({
          title: data.title,
          description: data.description,
          authorId: user?.id ?? "",
          image: url ?? "https://via.placeholder.com/1280x500"
        })
        .then(() => {
          Notiflix.Notify.success('Post Created!')
          setPreviewIMG("")
          setImage(undefined)
          refetch().catch((err: { message: string }) => Notiflix.Notify.failure(err.message))
          reset()
          setIsLoading(false)
        })
        .catch((err: { message: string }) => Notiflix.Notify.failure(err.message))
        .finally(() => setIsLoading(false))
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

  const onDeletePost = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    const getPost = data?.find(post => post.id == postID)
    if(getPost?.image){
      const deletedImg = ref(storage, `${getPost.image.split("/").at(-1)!.split("?")[0] ?? ""}`)
      deleteObject(deletedImg).catch((err: string) => Notiflix.Notify.failure(err))
    }
    setIsDeleteLoading(true)
    deletePost.mutateAsync({
      id: postID
    })
    .then(() => {
      Notiflix.Notify.success('Post Deleted!')
      setPostID("")
      refetch().catch((err: { message: string }) => Notiflix.Notify.failure(err.message))
      setModal(false)
      setIsDeleteLoading(false)
    })
    .catch((err: { message: string }) => Notiflix.Notify.failure(err.message))
    .finally(() => setIsDeleteLoading(false))
  }

  return (
    <main className="max-w-[1200px] mx-auto p-6">
      <div className={`fixed inset-0 z-[100] bg-black/10 grid place-items-center transition duration-250 ${modal ? "scale-1" : "scale-0"}`} onClick={() => setModal(false)}>
        <div className='text-white bg-[#303237] p-6 rounded-md m-4'>
          <p className='text-gray-200'>Are you sure you want to delete this post?</p>
          <div className="flex mt-4 justify-center gap-4">
            <button className='text-gray-300' onClick={() => setModal(false)}>Cancel</button>
            <button disabled={isDeleteLoading} className='text-white bg-red-500 p-2 rounded-md' onClick={(e) => onDeletePost(e)}>Delete</button>
          </div>
        </div>
      </div>
      <button className='text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-2 rounded-md cursor-pointer flex items-center gap-2' onClick={() => router.back()}>
        <FontAwesomeIcon icon={faArrowLeft} className='w-4' />
        <span>Go Back</span>
      </button>
      <div className='bg-[#303134] p-8 rounded-md my-4 flex flex-col items-center'>
        {
          isLoaded ?
          <>
            <Image src={user?.profileImageUrl ?? ""} alt="image" className='rounded-full mb-4' width={200} height={200} placeholder="blur" blurDataURL={blurImage} />
            <h1 className="text-xl md:text-3xl">{user?.fullName}</h1>
          </>
          : <Loader />
        }
      </div>
      <ul className="flex my-4 gap-2">
        <li className={`text-sm md:text-md text-[#bdc1c6] cursor-pointer p-3 rounded-md ${tab == 0 ? "text-white bg-white/10" : ""}`} onClick={() => setTab(0)}>Create Post</li>
        <li className={`text-sm md:text-md text-[#bdc1c6] cursor-pointer p-3 rounded-md ${tab == 1 ? "text-white bg-white/10" : ""}`} onClick={() => setTab(1)}>My Posts</li>
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
            <button disabled={isLoading} className='w-full rounded-md outline-none bg-green-500 hover:bg-green-600 text-white py-3 text-sm md:text-lg'>Post</button>
          </form>
        : 
        <div className="grid grid-cols-1 my-4">
          {  
            data?.map(el => (
              <PostBox post={el} comments={allComments as allComment} onClick={() => router.push(`/post/${el.id || ""}`)} isUser key={el.id} onClickDelete={(e) => {
                e.stopPropagation()
                setPostID(el.id)
                setModal(true)
              }}/>
            ))
          }
        </div>
        
      }
      
    </main>
  )
}

export default Profile