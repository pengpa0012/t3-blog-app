import { User } from "@clerk/nextjs/server"

export const mapUser = (user: User) => {
  return {
    id: user.id,
    name: user.firstName,
    email: user.emailAddresses,
    image: user.profileImageUrl
  }
}