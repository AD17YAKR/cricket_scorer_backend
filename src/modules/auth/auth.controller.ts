import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/entity/user.entity';
import { LoginUserDto, CreateUserDto } from '../user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: LoginUserDto): Promise<{ access_token: string }> {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() user: CreateUserDto): Promise<User> {
    return this.authService.register(user);
  }
}
