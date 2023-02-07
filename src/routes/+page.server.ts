import type { PageServerLoadEvent } from "./$types";
import { auth } from "../lib/server/lucia";
import type { ActionFailure } from "@sveltejs/kit";
import { fail, redirect } from "@sveltejs/kit";

export async function load({ cookies }: PageServerLoadEvent) {
  const sessionid = cookies.get("sessionid");
  if (!sessionid) {
    return;
  }
  try {
    await auth.validateSession(sessionid);
  } catch (error) {
    cookies.delete("sessionid");
    return;
  }
  throw redirect(302, `/todos`);
}

type AuthCredentialsResult =
  [null, { username: string, password: string }]
  | [ActionFailure<{ message: string }>, null];

async function getAuthCredentials(request: Request): Promise<AuthCredentialsResult> {
  const data = await request.formData();
  const usernameFormData = data.get("username");
  const passwordFormData = data.get("password");
  if (!usernameFormData || !passwordFormData) {
    return [fail(400, { message: "No username or password provided" }), null];
  }
  const username = usernameFormData.toString();
  const password = passwordFormData.toString();
  return [null, { username, password }];
}

export const actions = {
  signUp: async ({ request, cookies }: PageServerLoadEvent) => {
    try {
      const [error, result] = await getAuthCredentials(request);
      if (error) {
        return error;
      }
      const { username, password } = result;
      const { userId } = await auth.createUser({
        key: {
          providerId: "username",
          providerUserId: username,
          password
        },
        attributes: {}
      });
      const session = await auth.createSession(userId);
      cookies.set("sessionid", session.sessionId);
    } catch (error) {
      console.error(error);
      return fail(500, { message: "Something went wrong" });
    }
    throw redirect(302, `/todos`);
  },
  signIn: async ({ request, cookies }: PageServerLoadEvent) => {
    const [error, result] = await getAuthCredentials(request);
    if (error) {
      return error;
    }
    const { username, password } = result;
    try {
      const { userId } = await auth.validateKeyPassword("username", username, password);
      const session = await auth.createSession(userId);
      cookies.set("sessionid", session.sessionId);
    } catch (error) {
      console.log(error);
      return fail(401, { message: "There are no such username and password combination" });
    }
    throw redirect(302, `/todos`);
  },
  signOut: async ({ cookies }: PageServerLoadEvent) => {
    const sessionId = cookies.get("sessionid");
    if (!sessionId) {
      return;
    }
    await auth.invalidateSession(sessionId);
    cookies.delete("sessionid");
  }
};