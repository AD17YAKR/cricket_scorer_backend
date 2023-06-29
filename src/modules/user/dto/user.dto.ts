import { IsDefined, IsString, IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsDefined()
  @IsString()
  userName: string;

  @IsDefined()
  @IsString()
  password: string;
}

export class CreateUserDto {
  @IsDefined()
  @IsString()
  username: string;

  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  @MinLength(6)
  password: string;
}
