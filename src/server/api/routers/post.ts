import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  // deletePost
  // author  User @relation(fields: [authorId], references: [id])
  // authorId    String 
  // title   String
  // comments Comment[]
  // description String

  createPost: protectedProcedure.input(z.object({
    authorId: z.string(),
    title: z.string(),
    image: z.string(),
    description: z.string()
  })).mutation(async ({ ctx, input }) => {
    const {authorId, title, image, description} = input
    // const findUser = await clerkClient.users.getUserList().
    const result = await ctx.prisma.post.create({ data: {authorId, title, image, description}})

    return {
      post_created: result,
      message: "Post create successfully"
    }
  }),

  getAllPost: protectedProcedure.query(async({ ctx }) => {
    // const users = (await clerkClient.users.getUserList()).map(user => {
    //   return {
    //     name: user.firstName,
    //     email: user.emailAddresses,
    //     image: user.profileImageUrl
    //   }
    // })
    const posts = await ctx.prisma.post.findMany({ orderBy: [{ createdAt: "desc" }]  })
    return {
      posts
    }
  }),

  getPost: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const result = await ctx.prisma.post.findUnique({where: {id: input.id}});
    return result
  }),

});