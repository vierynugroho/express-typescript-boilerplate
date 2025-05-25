import { z } from 'zod';

export const commonValidations = {
  id: z.union([
    z.string().uuid('ID harus berupa UUID yang valid'),
    z
      .string()
      .refine(
        (data) => !Number.isNaN(Number(data)),
        'ID harus berupa nilai numerik'
      )
      .transform(Number)
      .refine((num) => num > 0, 'ID harus berupa angka positif'),
  ]),
};
