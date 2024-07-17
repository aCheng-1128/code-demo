import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export type User = any;

@Injectable()
export class UsersService {
  private readonly usersFilePath = path.join(
    process.cwd(),
    'src/modules/users',
    'users.json',
  );

  private readUsersFromFile(): User[] {
    if (!fs.existsSync(this.usersFilePath)) {
      return [];
    }
    const data = fs.readFileSync(this.usersFilePath, 'utf-8');
    return JSON.parse(data);
  }

  private writeUsersToFile(users: User[]): void {
    fs.writeFileSync(this.usersFilePath, JSON.stringify(users, null, 2));
  }

  async findOne(username: string): Promise<User | undefined> {
    const users = this.readUsersFromFile();
    return users.find((user) => user.username === username);
  }

  async create(user: User): Promise<void> {
    const users = this.readUsersFromFile();
    users.push(user);
    this.writeUsersToFile(users);
  }
}
