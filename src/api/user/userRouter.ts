import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import {
  CreateUserSchema,
  GetUserSchema,
  UpdateUserSchema,
  UserSchema,
} from '@/api/user/userModel';
import { userController } from './userController';
import { validateRequest } from '@/common/middleware/validateRequest';

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register('User', UserSchema);

userRegistry.registerPath({
  method: 'get',
  path: '/users',
  tags: ['User'],
  responses: createApiResponse(z.array(UserSchema), 'Success'),
});

userRegistry.registerPath({
  method: 'get',
  path: '/users/{id}',
  tags: ['User'],
  request: { params: GetUserSchema },
  responses: createApiResponse(UserSchema, 'Success'),
});

userRegistry.registerPath({
  method: 'post',
  path: '/users',
  tags: ['User'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserSchema,
        },
      },
    },
  },
  responses: createApiResponse(UserSchema, 'Success'),
});

userRegistry.registerPath({
  method: 'put',
  path: '/users/{id}',
  tags: ['User'],
  request: {
    params: GetUserSchema,
    body: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
  },
  responses: createApiResponse(UserSchema, 'Success'),
});

userRegistry.registerPath({
  method: 'delete',
  path: '/users/{id}',
  tags: ['User'],
  request: { params: GetUserSchema },
  responses: createApiResponse(UserSchema, 'Success'),
});

userRouter
  .route('/')
  .get(userController.getUsers)
  .post(validateRequest({ body: CreateUserSchema }), userController.createUser);

userRouter
  .route('/:id')
  .get(validateRequest({ params: GetUserSchema }), userController.getUser)
  .put(
    validateRequest({ params: GetUserSchema, body: UpdateUserSchema }),
    userController.updateUser
  )
  .delete(
    validateRequest({ params: GetUserSchema }),
    userController.deleteUser
  );
