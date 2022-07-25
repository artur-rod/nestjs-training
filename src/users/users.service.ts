import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/createUserDTO';
import { UpdateUserDTO } from './dto/updateUserDTO';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    const user = this.userRepository.create(data);
    const userSaved = await this.userRepository.save(user);
    if (!userSaved) {
      throw new InternalServerErrorException('User creation failed');
    }
    return userSaved;
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.update(user, { ...data });
    const updatedUser = this.userRepository.create({ ...user, ...data });
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.findOne(id);
    const deletedUser = await this.userRepository.delete(user);
    if (!deletedUser) {
      return false;
    }
    return true;
  }
}
