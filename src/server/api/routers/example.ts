import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAllPost: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),

  // getPost: publicProcedure.query(({ ctx, input }) => {
  //   return ctx.prisma.post.findFirst({where: {id: input.id}});
  // }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

// Create a post and query it