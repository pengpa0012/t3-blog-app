import dayjs from 'dayjs'
import Image from 'next/image'
import React from 'react'
import { blurImage } from '~/utils/helper'
import relativeTime from "dayjs/plugin/relativeTime";
import type { EmailAddress } from '@clerk/nextjs/server';
dayjs.extend(relativeTime);
import type { Post }from "@prisma/client"
import { useUser } from '@clerk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons'

type allUsers = {
  id: string;
  name: string | null;
  email: EmailAddress[];
  image: string;
}[]

type allComment = {
  id: string;
  postId: string | null
}[]

export const PostBox = ({users, isUser, post, onClick, onClickDelete, comments}: { users?: allUsers, isUser?: boolean, post: Post, onClick?: () => void, onClickDelete?: (id: React.MouseEvent<HTMLElement>) => void, comments: allComment}) => {
  const {user} = useUser()

  return (
    <div className={`p-4 bg-[#303134] rounded-md text-[#bdc1c6] cursor-pointer my-4 relative`} onClick={onClick}>
      <div>
        <div className="relative w-full bg-[#252525] rounded-md min-h-[300px]">
          <Image loading="lazy" src={post.image ?? ""} fill alt="image" className="object-contain" placeholder="blur" blurDataURL={blurImage} />
        </div>
        <div className="my-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <h3 className="text-md md:text-2xl">{post.title}</h3>
          <p className='text-sm md:text-md'>{dayjs(post.createdAt).format(`MMMM DD YYYY · h:mma`)}</p>
        </div>
        <p>{isUser ? user?.firstName : users?.find(user => user.id == post.authorId)?.name}</p>
        <div className='flex items-center gap-1 mb-2'>
          <FontAwesomeIcon icon={faComment} className='w-4' />
          <p className='text-sm'>{comments?.filter(comment => comment.postId == post.id).length}</p>
        </div>
      </div>     
      {isUser && <div className='absolute cursor-pointer right-[-10px] top-[-10px] bg-red-500 h-[30px] w-[30px] grid place-items-center z-[60] rounded-full' onClick={onClickDelete}>
        <span>x</span>
      </div> }  
    </div>
  )
}
