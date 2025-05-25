import { z } from 'zod';

export const commonValidations = {
  id: {
    uuid: z.string().uuid('ID harus berupa UUID yang valid'),
    number: z.number().positive('ID harus berupa angka positif'),
    any: z.union([
      z.string().uuid('ID harus berupa UUID yang valid'),
      z.number().positive('ID harus berupa angka positif'),
      z
        .string()
        .refine(
          (data) => !Number.isNaN(Number(data)),
          'ID harus berupa nilai numerik'
        )
        .transform(Number)
        .refine((num) => num > 0, 'ID harus berupa angka positif'),
    ]),
  },
};
