import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaError } from 'prisma-error-enum';
import { getEnv } from './config';

export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },
      ],
    });
    this.initLogging();
    this.trackConnectionIssues();
  }

  private initLogging(): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('query', (e: Prisma.QueryEvent) => {
      if (getEnv('LOG_LEVEL') === 'debug') {
        console.debug({
          duration: e.duration,
          query: e.query,
          params: e.params,
        });
      }
    });
  }

  private trackConnectionIssues(): void {
    // Handle database connection issues - kill instance if connection is lost
    this.$use(
      async (
        params: Prisma.MiddlewareParams,
        next: (params: Prisma.MiddlewareParams) => Promise<unknown>,
      ): Promise<unknown> => {
        try {
          return await next(params);
        } catch (error: unknown) {
          if (error instanceof Error) {
            let reasonForTermination = '';

            if (error instanceof Prisma.PrismaClientInitializationError) {
              reasonForTermination = 'PrismaClientInitializationError';
            }
            if (error instanceof Prisma.PrismaClientRustPanicError) {
              reasonForTermination = 'PrismaClientRustPanicError';
            }
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
              if (error.code === PrismaError.CouldNotConnectToDatabase) {
                reasonForTermination = 'Database connection error';
              }
              if (error.code === PrismaError.ConnectionTimedOut) {
                reasonForTermination = 'Database connection timed out';
              }
            }
            if (reasonForTermination) {
              console.error({
                message: `FATAL: ${reasonForTermination}. Terminating instance...`,
                error,
              });
              process.exit(1); // exit with failure
            }
          }
          throw error;
        }
      },
    );
  }
}

export const prisma = new PrismaService();

let wasConnectCalled = false;

/** Connect to database. Can be called multiple times, but will try to connect only once. */
export async function connectToDatabase(): Promise<void> {
  try {
    if (wasConnectCalled) {
      return;
    }
    wasConnectCalled = true;
    console.log(`Connecting to "${getEnv('DATABASE_URL')}"...`);
    await prisma.$connect();
    console.log('Connected to database successfully');
  } catch (error) {
    console.error(`DB Connection failed:`, error);
    process.exit(1);
  }
}

void connectToDatabase();
