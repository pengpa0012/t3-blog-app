import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  // createComment
  // deleteComment

  getAllComment: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.comment.findMany();
  }),

});