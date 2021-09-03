import { IsString, IsNotEmpty, IsBooleanString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  loverId: string;

  @IsString()
  loverName: string;

  @IsString()
  firstDayMet?: string;

  @IsBooleanString()
  isStorageFamily: string;

  @IsBooleanString()
  isStorageFriend: string;

  @IsBooleanString()
  isStorageLove: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
