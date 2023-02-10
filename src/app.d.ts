// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

/// <reference types="lucia-auth" />
declare namespace Lucia {
  type Auth = import('./lucia.ts').Auth;
  type UserAttributes = {
    username: string;
    photoUrl?: string;
    isOnline: boolean;
  };
}

export {};
