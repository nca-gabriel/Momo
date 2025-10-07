import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const { handlers } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
});

export const { GET, POST } = handlers;
