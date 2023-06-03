import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  // createComment
  // deleteComment

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

  getAllComment: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.comment.findMany({ orderBy: [{ createdAt: "desc" }] });
  }),

});