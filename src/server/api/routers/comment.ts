import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { mapUser } from "~/utils/helper";

export const commentRouter = createTRPCRouter({

  createComment: protectedProcedure.input(z.object({ postId: z.string(), comment: z.string(), authorId: z.string() })).mutation(async ({ctx, input}) => {
    const { postId, comment, authorId } = input
    const result = await ctx.prisma.comment.create({
      data: {
        authorId,
        postId,
        comment
      }
    })

    return {
      message: "Comment Created",
      result
    }
  }),

  getCommentByPost: protectedProcedure.input(z.object({ postId: z.string()})).query(async ({ ctx, input }) => {
    const result = await ctx.prisma.comment.findMany({ where: {postId: input.postId }, orderBy: [{ createdAt: "desc" }] })
    
    const users = (await clerkClient.users.getUserList()).filter(user => result.some(comment => comment.authorId === user.id)).map(mapUser)

    return {
      result,
      users
    }
  }),

  getAllComments: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.comment.findMany()

    return result
  })
})