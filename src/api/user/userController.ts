import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { userService } from '@/api/user/userService';
import { ServiceResponse } from '../../common/models/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { CreateUserType } from './userModel';

class UserController {
  public getUsers: RequestHandler = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await userService.findAll();

      const serviceResponse = ServiceResponse.success(
        'users data retrieved successfully',
        users,
        StatusCodes.OK
      );

      res.status(serviceResponse.statusCode).send(serviceResponse);
    } catch (error) {
      console.log('[CONTROLLER] - ERROR OCCURED');
      next(error);
    }
  };

  public getUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id as string;

      const user = await userService.findById(id);

      const serviceResponse = ServiceResponse.success(
        'user data retrieved successfully',
        user,
        StatusCodes.OK
      );

      res.status(serviceResponse.statusCode).send(serviceResponse);
    } catch (error) {
      console.log('[CONTROLLER] - ERROR OCCURED');
      next(error);
    }
  };

  public createUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData = req.body as CreateUserType;

      const user = await userService.create(userData);

      const serviceResponse = ServiceResponse.success(
        'user successfully created',
        user,
        StatusCodes.CREATED
      );

      res.status(serviceResponse.statusCode).send(serviceResponse);
    } catch (error) {
      console.log('[CONTROLLER] - ERROR OCCURED DURING CREATE');
      next(error);
    }
  };

  public updateUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id as string;
      const userData = req.body;

      const user = await userService.update(id, userData);

      const serviceResponse = ServiceResponse.success(
        'user successfully updated',
        user,
        StatusCodes.OK
      );

      res.status(serviceResponse.statusCode).send(serviceResponse);
    } catch (error) {
      console.log('[CONTROLLER] - ERROR OCCURED DURING UPDATE');
      next(error);
    }
  };

  public deleteUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id as string;

      const user = await userService.delete(id);

      const serviceResponse = ServiceResponse.success(
        'user successfully deleted',
        user,
        StatusCodes.OK
      );

      res.status(serviceResponse.statusCode).send(serviceResponse);
    } catch (error) {
      console.log('[CONTROLLER] - ERROR OCCURED DURING DELETE');
      next(error);
    }
  };
}

export const userController = new UserController();
