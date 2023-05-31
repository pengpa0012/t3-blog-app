import { SignIn } from '@clerk/nextjs'
import React from 'react'

function signin() {
  return (
    <div className="min-h-screen grid place-items-center">
      <SignIn />
    </div>
  )
}

export default signin