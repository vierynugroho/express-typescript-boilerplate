import prismaClient from '@/config/prisma';
import { User } from '../../../generated/prisma';

export class UserRepository {
  async findAllAsync() {
    try {
      const users = await prismaClient.user.findMany();
      return users;
    } catch (error) {
      console.log('[REPOSITORY] - ERROR OCCURED');
      throw error;
    }
  }

  async findByIdAsync(id: string): Promise<User | null> {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  async createAsync(userData: Partial<User>): Promise<User> {
    try {
      const user = await prismaClient.user.create({
        data: userData,
      });
      return user;
    } catch (error) {
      console.log('[REPOSITORY] - ERROR OCCURED DURING CREATE');
      throw error;
    }
  }

  async updateAsync(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const user = await prismaClient.user.update({
        where: {
          id,
        },
        data: userData,
      });
      return user;
    } catch (error) {
      console.log('[REPOSITORY] - ERROR OCCURED DURING UPDATE');
      throw error;
    }
  }

  async deleteAsync(id: string): Promise<User | null> {
    try {
      const user = await prismaClient.user.delete({
        where: {
          id,
        },
      });
      return user;
    } catch (error) {
      console.log('[REPOSITORY] - ERROR OCCURED DURING DELETE');
      throw error;
    }
  }
}
