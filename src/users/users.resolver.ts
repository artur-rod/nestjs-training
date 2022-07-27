import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlGuard } from '../auth/guards/gql.guard';
import { CreateUserDTO } from './dto/createUserDTO';
import { UpdateUserDTO } from './dto/updateUserDTO';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @UseGuards(GqlGuard)
  @Query(() => [User])
  async listUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(GqlGuard)
  @Query(() => User)
  async getUserById(@Args('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @UseGuards(GqlGuard)
  @Query(() => User)
  async getUserByEmail(@Args('email') email: string): Promise<User> {
    return await this.usersService.findOneByEmail(email);
  }

  @UseGuards(GqlGuard)
  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserDTO): Promise<User> {
    return await this.usersService.createUser(data);
  }

  @UseGuards(GqlGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('data') data: UpdateUserDTO,
  ): Promise<User> {
    return await this.usersService.updateUser(id, data);
  }

  @UseGuards(GqlGuard)
  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
