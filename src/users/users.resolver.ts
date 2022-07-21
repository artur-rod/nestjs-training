import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDTO } from './dto/createUserDTO';
import { UpdateUserDTO } from './dto/updateUserDTO';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  async listUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Query(() => User)
  async getUser(@Args('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserDTO): Promise<User> {
    return await this.usersService.createUser(data);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('data') data: UpdateUserDTO,
  ): Promise<User> {
    return await this.usersService.updateUser(id, data);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
