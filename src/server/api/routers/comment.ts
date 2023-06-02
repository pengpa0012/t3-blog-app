import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  // createComment
  // deleteComment

  getAllComment: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.comment.findMany();
  }),

});