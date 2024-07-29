import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      id: user.id,
      token: this.jwtService.sign(payload),
    };
  }

  async register(user: User) {
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

    // 创建用户并获取新用户的 id
    const userId = await this.usersService.create(newUser);

    // 生成 JWT 令牌
    const payload = { username: newUser.username, sub: userId };
    const token = this.jwtService.sign(payload);

    return {
      id: userId,
      token: token,
      message: 'User registered successfully',
    };
  }
}
