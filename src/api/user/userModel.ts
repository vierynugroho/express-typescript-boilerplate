import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nama tidak boleh kosong').optional(),
  email: z.string().email('Format email tidak valid').optional(),
  whatsapp: z
    .string()
    .regex(/^[0-9]+$/, 'Nomor WhatsApp hanya boleh berisi angka')
    .optional(),
  profile_pic: z.string().optional(),
  otp_token: z.string().optional(),
  secret_key: z.string().optional(),
  role: z
    .enum(['admin', 'user', 'guest'], {
      errorMap: () => ({
        message: 'Role harus salah satu dari: admin, user, atau guest',
      }),
    })
    .optional(),
  is_verified: z.boolean().default(false).optional(),
  provider: z.string().optional(),
  provider_account_id: z.string().optional(),
  job_title: z.string().optional(),
  address_street: z.string().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  regency: z.string().optional(),
  district: z.string().optional(),
  village: z.string().optional(),
  createdAt: z.date().optional(),
});

export const GetUserSchema = z.object({
  id: commonValidations.id,
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  otp_token: true,
  secret_key: true,
  provider: true,
  provider_account_id: true,
  createdAt: true,
}).required({
  name: true,
  email: true,
});
export type CreateUserType = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = UserSchema.omit({
  id: true,
  otp_token: true,
  secret_key: true,
  provider: true,
  provider_account_id: true,
  createdAt: true,
}).partial();
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
