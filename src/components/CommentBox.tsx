import dayjs from 'dayjs'
import Image from 'next/image'
import relativeTime from "dayjs/plugin/relativeTime";
import type { EmailAddress } from '@clerk/nextjs/server';
import type { Comment }from "@prisma/client"
dayjs.extend(relativeTime);

type users = {
  id: string;
  name: string | null;
  email: EmailAddress[];
  image: string;
}[]

export const CommentBox = ({users, comment}: {users: users, comment: Comment}) => {
  return (
    <div className='flex items-center'>
      <Image src={users.find(user => user.id == comment.authorId)?.image ?? ""} alt="image" className='rounded-full mr-2 w-45' width={45} height={45} />
      <div className='bg-[#303134] rounded-md my-2 text-[#bdc1c6] p-2 w-full'>
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm sm:text-md">{users.find(user => user.id == comment.authorId)?.name}</h4>
          <p className='text-xs sm:text-sm'>{dayjs(comment.createdAt).fromNow()}</p>
        </div>
        <p className='text-xs sm:text-sm break-all'>{comment.comment}</p>
      </div>
    </div>
  )
}
