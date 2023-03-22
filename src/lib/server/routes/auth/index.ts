import type { Context } from '../../helpers';
import { signUp, signUpCommand, type SignUpRequest } from './signUp';
import { signIn, signInCommand, type SignInRequest } from './signIn';
import { reSignIn, reSignInCommand, type ReSignInRequest } from './reSignIn';
import { signOut, signOutCommand, type SignOutRequest } from './signOut';
import {
  deleteUser,
  deleteUserCommand,
  type DeleteUserRequest,
} from './deleteUser';

export type AuthRequest =
  | SignUpRequest
  | SignInRequest
  | ReSignInRequest
  | SignOutRequest
  | DeleteUserRequest;

export async function routesAuth(
  context: Context,
  request: AuthRequest,
): Promise<void> {
  switch (request.t) {
    case signUpCommand:
      return signUp(context, request);
    case signInCommand:
      return signIn(context, request);
    case reSignInCommand:
      return reSignIn(context, request);
    case signOutCommand:
      return signOut(context);
    case deleteUserCommand:
      return deleteUser(context, request);
  }
}
