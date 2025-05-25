import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import type { User } from '@/api/user/userModel';
import type { ServiceResponse } from '@/common/models/serviceResponse';
import { app } from '@/server';

// Data pengujian
const mockUsers: User[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'User Test 1',
    email: 'user1@test.com',
    whatsapp: '+6281234567890',
    profile_pic: 'https://example.com/pic1.jpg',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'User Test 2',
    email: 'user2@test.com',
    whatsapp: '+6281234567891',
    profile_pic: 'https://example.com/pic2.jpg',
    createdAt: new Date('2023-01-02'),
  },
];

// Mock repository
vi.mock('@/api/user/userRepository', () => ({
  findAllUsers: vi.fn().mockResolvedValue(mockUsers),
  findUserById: vi.fn().mockImplementation((id: string) => {
    const user = mockUsers.find((u) => u.id === id);
    return Promise.resolve(user || null);
  }),
}));

describe('User API Endpoints', () => {
  describe('GET /users', () => {
    it('should return a list of users', async () => {
      // Act
      const response = await request(app).get('/users');
      const responseBody = response.body as ServiceResponse<User[]>;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.meta?.message).toContain('Users found');
      expect(responseBody.data?.length).toEqual(mockUsers.length);
      responseBody.data?.forEach((user, index) =>
        compareUsers(mockUsers[index], user)
      );
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user for a valid ID', async () => {
      // Arrange
      const testId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedUser = mockUsers.find((user) => user.id === testId);

      // Act
      const response = await request(app).get(`/users/${testId}`);
      const responseBody = response.body as ServiceResponse<User>;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.meta?.message).toContain('User found');
      if (!expectedUser)
        throw new Error('Invalid test data: expectedUser is undefined');
      compareUsers(expectedUser, responseBody.data as User);
    });

    it('should return a not found error for non-existent ID', async () => {
      // Arrange
      const testId = '123e4567-e89b-12d3-a456-426614174999';

      // Act
      const response = await request(app).get(`/users/${testId}`);
      const responseBody = response.body as ServiceResponse<null>;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.meta?.message).toContain('User not found');
      expect(responseBody.data).toBeNull();
    });

    it('should return a bad request for invalid ID format', async () => {
      // Act
      const invalidInput = 'abc';
      const response = await request(app).get(`/users/${invalidInput}`);
      const responseBody = response.body as ServiceResponse<null>;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.meta?.message).toContain('Invalid input');
      expect(responseBody.data).toBeNull();
    });
  });
});

function compareUsers(mockUser: User, responseUser: User) {
  if (!mockUser || !responseUser) {
    throw new Error('Invalid test data: mockUser or responseUser is undefined');
  }

  expect(responseUser.id).toEqual(mockUser.id);
  expect(responseUser.name).toEqual(mockUser.name);
  expect(responseUser.email).toEqual(mockUser.email);
  expect(responseUser.whatsapp).toEqual(mockUser.whatsapp);
  expect(responseUser.profile_pic).toEqual(mockUser.profile_pic);

  // Jika createdAt ada dan bukan undefined
  if (responseUser.createdAt && mockUser.createdAt) {
    expect(new Date(responseUser.createdAt)).toEqual(mockUser.createdAt);
  }
}
