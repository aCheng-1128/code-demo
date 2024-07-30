import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface IConversation {
  id: string;
  name: string;
}

export type User = {
  username: string;
  password: string;
  id: string;
  conversations?: IConversation[];
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

  async create(user: User): Promise<string> {
    const users = this.readUsersFromFile();
    const newUser = {
      ...user,
      id: uuidv4(),
    };
    users.push(newUser);
    this.writeUsersToFile(users);
    return newUser.id;
  }

  async updateConversations(
    userId: string,
    conversation: { id: string; name: string },
  ): Promise<void> {
    const users = this.readUsersFromFile();
    const user = users.find((user) => user.id === userId);
    if (user) {
      if (!user.conversations) {
        user.conversations = [];
      }
      if (!user.conversations.find((c) => c.id === conversation.id)) {
        user.conversations.push(conversation);
        this.writeUsersToFile(users);
      }
    }
  }

  async getConversations(userId: string): Promise<IConversation[] | undefined> {
    const user = await this.findById(userId);
    return user?.conversations || [];
  }

  async clearConversationIds(userId: string): Promise<void> {
    const users = this.readUsersFromFile();
    const user = users.find((user) => user.id === userId);
    if (user) {
      user.conversations = [];
      this.writeUsersToFile(users);
    }
  }
}
