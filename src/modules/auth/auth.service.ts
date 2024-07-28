import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: any) {
    const existingUser = await this.usersService.findOne(user.username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // 验证输入
    if (!user.username || !user.password) {
      throw new Error('Username and password are required');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = { ...user, password: hashedPassword };

    await this.usersService.create(newUser);

    // 生成 JWT 令牌
    const payload = { username: newUser.username, sub: newUser.userId };
    const token = this.jwtService.sign(payload);

    return {
      message: 'User registered successfully',
      token: token,
    };
  }
}
