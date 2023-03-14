import type { Actions } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const actions: Actions = {
  deleteUser: async ({ url }) => {
    const id = url.searchParams.get('id');

    if (!id) {
      return {
        status: 400,
        body: 'Invalid request',
      };
    }

    try {
      await prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        body: 'Internal server error',
      };
    }

    return {
      status: 200,
      body: 'User deleted',
    };
  },
};
