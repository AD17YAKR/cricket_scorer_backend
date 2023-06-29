import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { LoginUserDto, CreateUserDto } from '../user/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { jwtSecret } from 'src/config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }

  async login(user: LoginUserDto): Promise<{ access_token: string }> {
    const { userName, password } = user;
    const foundUser = await this.validateUser(userName, password);

    const payload = { username: foundUser.username };
    const signOptions: JwtSignOptions = { expiresIn: '1h' };
    const token = this.jwtService.sign(payload, {
      secret: jwtSecret,
      ...signOptions,
    });

    return {
      access_token: token,
    };
  }

  async register(user: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: user.username }, { email: user.email }],
    });

    if (existingUser) {
      if (existingUser.username === user.username) {
        throw new ConflictException('Username is already in use');
      }
      if (existingUser.email === user.email) {
        throw new ConflictException('Email is already in use');
      }
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({
      username: user.username,
      email: user.email,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }
}
