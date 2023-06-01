import { useRouter } from 'next/router'
import React from 'react'

function Post() {
  const router = useRouter()
  return (
    <main className="max-w-[1200px] mx-auto p-6">
      <button onClick={() => router.back()}>Go Back</button>
      <img src="https://via.placeholder.com/1280x500" className="w-full rounded-md my-4" />
      <h1 className="text-3xl">POST TITLE</h1>
      <p className="text-lg text-gray-300 my-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem facere laborum repellat? Repellendus sunt molestias ratione laborum, vitae ipsa nulla praesentium atque ipsam accusantium repudiandae tenetur? Soluta accusantium voluptatum quaerat laudantium, beatae deserunt magni suscipit voluptatem fugiat? Animi, quasi? Perspiciatis possimus fugit harum, eligendi rem quos natus culpa odit ipsum consectetur? Accusantium eveniet at laborum placeat quibusdam dolorem earum natus magnam, vitae unde incidunt recusandae molestiae. Aliquid, expedita quae? Quam maiores voluptate blanditiis animi eum aut, id quia corrupti ipsam ad recusandae omnis adipisci ea repudiandae dolores autem molestiae, eos enim vel! Ipsa iste reprehenderit pariatur quasi fugiat accusantium porro!</p>
      <h3 className="text-xl mt-20">Comments</h3>
      {
        [1,2,3,4,5].map(el => (
          <div className='bg-[#303134] rounded-md my-4 text-[#bdc1c6] p-2' key={el}>
            <h4 className="text-lg">User</h4>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt obcaecati accusantium velit!</p>
          </div>
        ))
      }
      <input type="text" placeholder='Comment...' className='bg-inherit w-full rounded-md p-2 border border-gray-500 outline-none' />
    </main>
  )
}

export default Post