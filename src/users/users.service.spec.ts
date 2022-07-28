import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TestUtil from '../shared/test/testUtil';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
    mockRepository.update.mockReset();
    mockRepository.delete.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find All Service', () => {
    it('should list all users', async () => {
      const validUser = TestUtil.ValidUser();
      mockRepository.find.mockReturnValue([validUser, validUser]);

      const users = await service.findAll();
      expect(users).toBeInstanceOf(Array<User>);
      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find One By Id Service', () => {
    it('should find a user', async () => {
      const validUser = TestUtil.ValidUser();
      mockRepository.findOne.mockReturnValue(validUser);

      const user = await service.findOne(validUser.id);
      expect(user).toBeInstanceOf(User);
      expect(user).toMatchObject({
        name: validUser.name,
        email: validUser.email,
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it("should return a Not Found Exception when user doesn't exists", async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findOne('1')).rejects.toBeInstanceOf(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find One By Email Service', () => {
    it('should find a user', async () => {
      const validUser = TestUtil.ValidUser();
      mockRepository.findOne.mockReturnValue(validUser);

      const user = await service.findOneByEmail(validUser.email);
      expect(user).toBeInstanceOf(User);
      expect(user).toMatchObject({
        name: validUser.name,
        email: validUser.email,
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it("should return a Not Found Exception when user doesn't exists", async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(
        service.findOneByEmail('invalid@email.com'),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('Create Service', () => {
    it('should create a user', async () => {
      const validUserData = TestUtil.ValidUserToCreate();
      const validUser = TestUtil.ValidUser();
      mockRepository.create.mockReturnValue(validUserData);
      mockRepository.save.mockReturnValue(validUserData);

      const createdUser = await service.createUser(validUserData);
      expect(createdUser).toBeInstanceOf(User);
      expect(createdUser).toMatchObject(validUser);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should return a Internal Server Error when failed', async () => {
      const validUserData = TestUtil.ValidUserToCreate();
      mockRepository.create.mockReturnValue(validUserData);
      mockRepository.save.mockReturnValue(null);

      await service.createUser(validUserData).catch((error) => {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error).toMatchObject({
          message: 'User creation failed',
        });
      });
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update Service', () => {
    it('Should update a user', async () => {
      const validUser = TestUtil.ValidUser();
      const updateUserData = {
        name: 'Updated Name',
        email: 'updated@email.com',
      };
      mockRepository.findOne.mockReturnValue(validUser);
      mockRepository.update.mockReturnValue({
        ...validUser,
        ...updateUserData,
      });
      mockRepository.create.mockReturnValue({
        ...validUser,
        ...updateUserData,
      });

      const updatedUser = await service.updateUser(
        validUser.id,
        updateUserData,
      );

      expect(updatedUser).toMatchObject(updateUserData);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it("should return a Not Found Exception when user doesn't exists", async () => {
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.update.mockReturnValue(null);

      await service.updateUser('1', {}).catch((error) => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error).toMatchObject({
          message: 'User not found',
        });
      });
      expect(mockRepository.update).toHaveBeenCalledTimes(0);
    });
  });

  describe('Delete User Service', () => {
    it('should delete a user', async () => {
      const validUser = TestUtil.ValidUser();
      mockRepository.findOne.mockReturnValue(validUser);
      mockRepository.delete.mockReturnValue(validUser);

      const deletedUser = await service.deleteUser(validUser.id);

      expect(deletedUser).toBeTruthy();
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it("should return a Not Found Exception when user doesn't exists", async () => {
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.delete.mockReturnValue(null);

      await service.deleteUser('1').catch((error) => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error).toMatchObject({
          message: 'User not found',
        });
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(0);
    });

    it('should return false when user deletion failed', async () => {
      const validUser = TestUtil.ValidUser();
      mockRepository.findOne.mockReturnValue(validUser);
      mockRepository.delete.mockReturnValue(null);

      const deletedUser = await service.deleteUser(validUser.id);

      expect(deletedUser).toBeFalsy();
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
