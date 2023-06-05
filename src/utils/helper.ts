import { User } from "@clerk/nextjs/server"

export const mapUser = (user: User) => {
  return {
    id: user.id,
    name: user.firstName,
    email: user.emailAddresses,
    image: user.profileImageUrl
  }
}

export const bytesToSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10)
  if (i === 0) return `${bytes} ${sizes[i]})`
  return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}