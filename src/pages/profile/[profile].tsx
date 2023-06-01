import { useRouter } from 'next/router'
import React from 'react'

function Profile() {
  const router = useRouter()

  return (
    <main className="max-w-[1200px] mx-auto p-6">
      <div>profile id: {router.query.profile}</div>
    </main>
  )
}

export default Profile