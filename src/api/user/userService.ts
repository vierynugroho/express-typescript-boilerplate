import { StatusCodes } from 'http-status-codes';

import { UserRepository } from '@/api/user/userRepository';
import { AppError } from '@/common/middleware/errorHandler';
import { User } from '../../../generated/prisma';

export class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  async findAll() {
    try {
      const users = await this.userRepository.findAllAsync();
      return users;
    } catch (error) {
      console.log('[SERVICE] - ERROR OCCURED');
      throw error;
    }
  }

  async findById(id: string) {
    const user = await this.userRepository.findByIdAsync(id);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'users data is empty');
    }

    return user;
  }

  async create(userData: Partial<User>) {
    try {
      const user = await this.userRepository.createAsync(userData);
      return user;
    } catch (error) {
      console.log('[SERVICE] - ERROR OCCURED DURING CREATE');
      throw error;
    }
  }

  async update(id: string, userData: Partial<User>) {
    try {
      const user = await this.userRepository.findByIdAsync(id);

      if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'user not found');
      }

      const userUpdate = await this.userRepository.updateAsync(id, userData);

      return userUpdate;
    } catch (error) {
      console.log('[SERVICE] - ERROR OCCURED DURING UPDATE');
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const user = await this.userRepository.deleteAsync(id);

      if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'user not found');
      }

      return user;
    } catch (error) {
      console.log('[SERVICE] - ERROR OCCURED DURING DELETE');
      throw error;
    }
  }
}

export const userService = new UserService();
