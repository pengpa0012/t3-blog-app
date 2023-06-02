import { useUser } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  // createPost
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
    const {title, description} = input
    const {user} = useUser()
    const result = await ctx.prisma.post.create({ data: {author: user?.id, title, description} as Prisma.PostCreateInput})

    return {
      post_created: result,
      message: "Post create successfully"
    }
  }),

  getAllPost: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),

  getPost: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const result = await ctx.prisma.post.findMany({where: {id: input.id}});
    return result
  }),

});