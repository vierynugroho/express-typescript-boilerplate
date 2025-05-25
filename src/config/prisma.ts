import { PrismaClient } from '../../generated/prisma/client';
import { env } from '../common/utils/envConfig';

const prismaClient = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (env.NODE_ENV !== 'production') globalThis.prisma = prismaClient;

export default prismaClient;
