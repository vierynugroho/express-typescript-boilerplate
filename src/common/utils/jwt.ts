import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { env } from './envConfig';

// Skema validasi untuk payload JWT
export const jwtPayloadSchema = z.object({
  userId: z.string().uuid('ID pengguna harus berupa UUID yang valid'),
  email: z.string().email('Email harus valid'),
  role: z.string().min(1, 'Role tidak boleh kosong'),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export const signJwt = (
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
  expiresIn: string = '1d'
): string => {
  const secret = env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET tidak ditemukan di environment variables');
  }

  const options: jwt.SignOptions = {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
    algorithm: 'HS256',
  };

  const token = jwt.sign(payload, secret as jwt.Secret, options);
  return token;
};

export const verifyJwt = (token: string): JwtPayload => {
  const secret = env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET tidak ditemukan di environment variables');
  }

  const decoded = jwt.verify(token, secret);
  const result = jwtPayloadSchema.safeParse(decoded);

  if (!result.success) {
    throw new Error('Format payload JWT tidak valid');
  }

  return result.data;
};
