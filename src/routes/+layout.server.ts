import type { PageServerLoadEvent } from "./$types";
import { prisma } from "../lib/server/prisma";
import { auth } from "../lib/server/lucia";

export async function load({ cookies }: PageServerLoadEvent) {
  const sessionid = cookies.get("sessionid");
  if (!sessionid) {
    return;
  }
  let userId = "";
  try {
    ({ userId } = await auth.validateSession(sessionid));
  } catch (error) {
    cookies.delete("sessionid");
    return;
  }
  if (userId) {
    return {
      userId,
      users: prisma.user.findMany()
    };
  }
}