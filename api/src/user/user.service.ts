import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(user: CreateUserDto) {
    return this.userRepository.create(user);
  }
  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
  async findByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }
  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async update(id: string, data: UpdateUserDto) {
    return this.userRepository.update(id, data);
  }
}
