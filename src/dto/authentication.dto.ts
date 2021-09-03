import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { User } from '../entity/user.entity';

export class AuthenticationDto {
  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  public toEntity(): User {
    const user = new User();
    user.email = this.email;
    user.password = this.password;
    return user;
  }
}

export class VerifiedEmailDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
