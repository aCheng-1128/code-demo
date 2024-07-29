import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export type User = {
  username: string;
  password: string;
  id: string;
  conversationIds?: string[]; // 改为数组类型
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

  async updateConversationIds(
    userId: string,
    conversationId: string,
  ): Promise<void> {
    const users = this.readUsersFromFile();
    const user = users.find((user) => user.id === userId);
    if (user) {
      if (!user.conversationIds) {
        user.conversationIds = [];
      }
      if (!user.conversationIds.includes(conversationId)) {
        user.conversationIds.push(conversationId);
        this.writeUsersToFile(users);
      }
    }
  }

  async getConversationIds(userId: string): Promise<string[] | undefined> {
    const user = await this.findById(userId);
    return user?.conversationIds || [];
  }

  async clearConversationIds(userId: string): Promise<void> {
    const users = this.readUsersFromFile();
    const user = users.find((user) => user.id === userId);
    if (user) {
      user.conversationIds = [];
      this.writeUsersToFile(users);
    }
  }
}
