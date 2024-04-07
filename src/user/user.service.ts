import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { RoleUpdateDto } from './dto/role.update.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role, User } from './entities';
import { IdGenerator } from 'src/util/id-generator';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {}

  async getRoleByName(roleName: string): Promise<Role> {
    return this.roleModel.findOne({ roleName: roleName }).exec();
  }

  async createUser(dto: SignupDto): Promise<User> {
    const isUser = await this.userModel.findOne({ email: dto.email }).exec();
    if (isUser) {
      throw new BadRequestException('User already exists.');
    }
    let role: Role;
    if (dto.roleId) {
      role = await this.roleModel.findById(dto.roleId).exec();
      if (!role) {
        throw new BadRequestException('Role not found.');
      }
    }

    const { firstName, lastName, email, password } = dto;

    const id = IdGenerator.generateId().toString();
    // console.log(id);

    const newUser = new this.userModel({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    console.log(newUser._id);
    await newUser.save();
    console.log(newUser._id);
    // newUser.role = await newUser.role;
    const savedUser = await newUser.save();
    delete savedUser.password;
    return savedUser;
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new BadRequestException('User not found.');
    }
    if (dto.firstName) user.firstName = dto.firstName;
    if (dto.lastName) user.lastName = dto.lastName;
    await user.save();

    delete user.password;

    return user;
  }

  async setUserRole(dto: RoleUpdateDto): Promise<User[]> {
    const response: User[] = [];
    const role = await this.roleModel.findById(dto.roleId).exec();
    if (!role) {
      throw new BadRequestException('Role not found.');
    }
    for (const userId of dto.userIds) {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        console.error(`User with ID ${userId} not found`);
        continue;
      }
      user.role = role;
      await user.save();
      delete user.password;
      response.push(user);
    }
    return response;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async findUserByEmailWithRole(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      return undefined;
    }
    const role = await user.role;
    if (role) {
      return {
        ...user.toObject(),
        role,
      };
    }
    return user.toObject();
  }

  async getRole(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async saveUser(user: User): Promise<User> {
    const userModelInstance = new this.userModel(user);
    return await userModelInstance.save();
  }

  async createUserWithoutPassword({
    email,
    firstName,
    lastName,
  }): Promise<User> {
    const newUser = new this.userModel({ email, firstName, lastName });
    return newUser.save();
  }
}
