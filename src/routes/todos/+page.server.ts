import type { PageServerLoadEvent } from "./$types";
import { prisma } from "../../lib/server/prisma";

export async function load({ cookies }: PageServerLoadEvent) {
  return {
    todos: prisma.todo.findMany()
  };
}