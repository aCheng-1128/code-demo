import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export type User = {
  username: string;
  password: string;
  id: string;
  conversationId?: string;
};

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

  async findById(userId: string): Promise<User | undefined> {
    const users = this.readUsersFromFile();
    return users.find((user) => user.id === userId);
  }

  async create(user: User): Promise<void> {
    const users = this.readUsersFromFile();
    users.push(user);
    this.writeUsersToFile(users);
  }

  async updateConversationId(
    userId: string,
    conversationId: string,
  ): Promise<void> {
    const users = this.readUsersFromFile();
    const user = users.find((user) => user.id === userId);
    if (user) {
      user.conversationId = conversationId;
      this.writeUsersToFile(users);
    }
  }

  async getConversationId(userId: string): Promise<string | undefined> {
    const user = await this.findById(userId);
    return user?.conversationId;
  }

  async clearConversationId(userId: string): Promise<void> {
    const users = this.readUsersFromFile();
    const user = users.find((user) => user.id === userId);
    if (user) {
      user.conversationId = undefined;
      this.writeUsersToFile(users);
    }
  }
}
