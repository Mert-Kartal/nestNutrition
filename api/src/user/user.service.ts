import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(data: CreateUserDto) {
    return this.userRepository.create(data);
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
    const user = await this.findById(id);
    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No data to update');
    }
    const updatePlain: UpdateUserDto = {};
    let newName = user.name;
    let newLastName = user.lastName;
    for (const key in data) {
      if (data[key] === undefined || data[key] === null || data[key] === '')
        continue;
      switch (key) {
        case 'name':
          updatePlain.name = data[key];
          newName = data[key];
          break;
        case 'lastName':
          updatePlain.lastName = data[key];
          newLastName = data[key];
          break;
        case 'username': {
          const existUsername = await this.findByUsername(data[key]);
          if (existUsername) {
            throw new BadRequestException('Username already exists');
          }
          updatePlain.username = data[key];
          break;
        }
        case 'email': {
          const existEmail = await this.findByEmail(data[key]);
          if (existEmail) {
            throw new BadRequestException('Email already exists');
          }
          updatePlain.email = data[key];
          break;
        }
        default:
          updatePlain[key] = data[
            key
          ] as (typeof updatePlain)[keyof UpdateUserDto];
      }
    }
    if (data.name !== undefined || data.lastName !== undefined) {
      updatePlain.fullName = `${newName} ${newLastName}`;
    }
    const updatedUser = await this.userRepository.update(id, updatePlain);
    return updatedUser;
  }
  async updateEmail() {}
  async findAll() {
    return this.userRepository.findAll();
  }
}
