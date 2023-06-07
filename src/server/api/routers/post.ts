import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { mapUser } from "~/utils/helper";

export const postRouter = createTRPCRouter({

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

  deletePost: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ctx, input}) => {
    const result = await ctx.prisma.post.delete({where: {id: input.id}})

    return {
      post_deleted: result,
      message: "Post Deleted!"
    }
  }),

  getAllPost: protectedProcedure.query(async({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({ orderBy: [{ createdAt: "desc" }] })
    const users = (await clerkClient.users.getUserList()).filter(user => {
      return posts.some(post => post.authorId === user.id)
    }).map(mapUser)
    
    return {
      posts,
      users
    }
  }),

  getPost: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const result = await ctx.prisma.post.findUnique({where: {id: input.id}})

    const users = (await clerkClient.users.getUserList()).filter(user => result?.authorId === user.id).map(mapUser)
    return {
      result,
      users
    }
  }),

  getUserPosts: protectedProcedure.input(z.object({ authorId: z.string() })).query(async ({ ctx, input }) => {
    const result = await ctx.prisma.post.findMany({where: {authorId: input.authorId}, orderBy: [{ createdAt: "desc" }]})
    return result
  })

});