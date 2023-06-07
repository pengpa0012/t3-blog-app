import dayjs from 'dayjs'
import Image from 'next/image'
import React from 'react'
import { blurImage } from '~/utils/helper'
import relativeTime from "dayjs/plugin/relativeTime";
import { EmailAddress } from '@clerk/nextjs/dist/types/server';
dayjs.extend(relativeTime);
import type { Post }from "@prisma/client"
import { useUser } from '@clerk/nextjs';

type allUsers = {
  id: string;
  name: string | null;
  email: EmailAddress[];
  image: string;
}[]

export const PostBox = ({users, isUser, post, onClick, onClickDelete}: { users?: allUsers, isUser?: boolean, post: Post, onClick?: () => void, onClickDelete?: (id: React.MouseEvent<HTMLElement>) => void}) => {
  const {user} = useUser()

  return (
    <div className={`p-4 bg-[#303134] rounded-md text-[#bdc1c6] cursor-pointer my-4 relative`} onClick={onClick}>
      <div>
        <div className="relative w-full min-h-[300px]">
          <Image loading="lazy" src={post.image ?? ""} fill alt="image" className="rounded-md object-contain" placeholder="blur" blurDataURL={blurImage} />
        </div>
        <div className="my-4 flex justify-between items-center">
          <h3 className="text-2xl">{post.title}</h3>
          <p>{dayjs(post.createdAt).fromNow()}</p>
        </div>
        <p>{isUser ? user?.firstName : users?.find(user => user.id == post.authorId)?.name}</p>
      </div>     
      {isUser && <div className='absolute cursor-pointer right-[-10px] top-[-10px] bg-red-500 h-[30px] w-[30px] grid place-items-center z-[60] rounded-full' onClick={onClickDelete}>
        <span>x</span>
      </div> }  
    </div>
  )
}
