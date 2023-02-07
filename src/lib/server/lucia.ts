import lucia from 'lucia-auth';
import prismaAdapter from '@lucia-auth/adapter-prisma';
// import redisAdapter from '@lucia-auth/session-adapter-redis';
import { prisma } from "./prisma";
// import Redis from 'ioredis';
// import { REDIS_PORT, REDIS_HOST } from '$env/dynamic/private';

// export const sessionClient = new Redis(REDIS_PORT, REDIS_HOST);
// export const userSessionsClient = sessionClient.duplicate();

// export const auth = lucia({
// 	adapter: {
// 		user: prismaAdapter(prisma),
// 		session: redisAdapter({
// 			session: sessionClient,
// 			userSessions: userSessionsClient
// 		}),
// 	},
// 	env: process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
// });

// sessionClient.connect();
// userSessionsClient.connect();

export const auth = lucia({
	adapter: prismaAdapter(prisma),
	env: process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
});

export type Auth = typeof auth;