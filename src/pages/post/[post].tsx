import { useRouter } from 'next/router'
import React from 'react'

function post() {
  const router = useRouter()
  return (
    <main className="max-w-[1200px] mx-auto p-6">
      <div>post id: {router.query.post}</div>
    </main>
  )
}

export default post