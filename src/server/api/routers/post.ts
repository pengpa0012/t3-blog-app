import { clerkClient } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  // deletePost
  // author  User @relation(fields: [authorId], references: [id])
  // authorId    String 
  // title   String
  // comments Comment[]
  // description String

  createPost: publicProcedure.input(z.object({
    authorId: z.string(),
    title: z.string(),
    description: z.string()
  })).mutation(async ({ ctx, input }) => {
    const {authorId, title, description} = input
    // const findUser = await clerkClient.users.getUserList().
    const result = await ctx.prisma.post.create({ data: {authorId, title, description}})

    return {
      post_created: result,
      message: "Post create successfully"
    }
  }),

  getAllPost: publicProcedure.query(async({ ctx }) => {
    // const users = (await clerkClient.users.getUserList()).map(user => {
    //   return {
    //     name: user.firstName,
    //     email: user.emailAddresses,
    //     image: user.profileImageUrl
    //   }
    // })
    const posts = await ctx.prisma.post.findMany();
    return {
      posts
    }
  }),

  getPost: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const result = await ctx.prisma.post.findMany({where: {id: input.id}});
    return result
  }),

});