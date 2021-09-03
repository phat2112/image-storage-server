import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { UserDto, CreateUserDto } from '../../dto/user.dto';
import { ResetPasswordDto } from '../../dto/authentication.dto';
import { Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async getByEmail(email: string): Promise<User> {
    const user = this.userRepo.findOne({ email });
    if (!user) {
      throw new HttpException('User is not exited', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepo.findOne(id);
    if (!user) {
      throw new HttpException('User is not exited', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async searchUser(value: string): Promise<User[]> {
    const users = await this.userRepo.find();
    return users.filter(
      (user) =>
        user.userName.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value),
    );
  }

  async updateUser(user: UserDto): Promise<User> {
    const foundUser = await this.userRepo.findOne({ userId: user.userId });
    const userFormatted = classToPlain({
      ...user,
      isStorageFamily: user.isStorageFamily === 'true',
      isStorageFriend: user.isStorageFriend === 'true',
      isStorageLove: user.isStorageLove === 'true',
    });
    if (foundUser) {
      const newUser = this.userRepo.merge(foundUser, userFormatted);
      return await this.userRepo.save({
        ...newUser,
        isUpdateInfo: true,
      });
    }
    throw new HttpException('User is not exited', HttpStatus.NOT_FOUND);
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const userFormatted = classToPlain({
      ...user,
      birthday: '',
      firstDayMet: '',
      loverId: '',
      loverName: '',
      isStorageFamily: false,
      isStorageFriend: false,
      isStorageLove: false,
      isUpdateInfo: false,
    });

    return await this.userRepo.save({
      ...userFormatted,
    });
  }

  async updateUserPassword(user: User): Promise<User> {
    return await this.userRepo.save(user);
  }
}
