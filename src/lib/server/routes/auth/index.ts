import type { Context } from '../../helpers';
import {
  signUp,
  signUpCommand,
  type SignUpRequest,
  type SignUpResponse,
} from './signUp';
import {
  signIn,
  signInCommand,
  type SignInRequest,
  type SignInResponse,
} from './signIn';
import {
  reSignIn,
  reSignInCommand,
  type ReSignInRequest,
  type ReSignInResponse,
} from './reSignIn';
import {
  signOut,
  signOutCommand,
  type SignOutRequest,
  type SignOutResponse,
} from './signOut';

export type AuthRequest =
  | SignUpRequest
  | SignInRequest
  | ReSignInRequest
  | SignOutRequest;

export type AuthResponse =
  | SignUpResponse
  | SignInResponse
  | ReSignInResponse
  | SignOutResponse;

export async function routesAuth(
  context: Context<AuthRequest, AuthResponse>,
): Promise<void> {
  switch (context.request.t) {
    case signUpCommand:
      return signUp(context);
    case signInCommand:
      return signIn(context);
    case reSignInCommand:
      return reSignIn(context);
    case signOutCommand:
      return signOut(context);
  }
}
