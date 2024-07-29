// src/modules/coze/coze.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UsersService } from '../users/users.service';

export type ChatStatus =
  | 'created'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'requires_action'
  | undefined;

@Injectable()
export class CozeService {
  private readonly authToken =
    'Bearer pat_eNHtvlW9QpJDP8B4nkD7mYaFzy8UeNkUZ7UDdn8YWgDnxmrjE7uEnB6VgefytSk9';
  private readonly bot_id = '7396221130178314250';
  private readonly headers = {
    Authorization: this.authToken,
    'Content-Type': 'application/json',
  };

  constructor(private readonly usersService: UsersService) {}

  private async getUserData(userId: string) {
    // 从数据库获取用户数据
    return await this.usersService.findById(userId);
  }

  // 生成会话
  async genConversation(userId: string) {
    const response = await axios.post(
      'https://api.coze.cn/v1/conversation/create',
      {},
      { headers: this.headers },
    );
    const conversationId = response.data.data.id;
    // 保存 conversationId 和 userId 的关系
    await this.usersService.updateConversationId(userId, conversationId);
    return conversationId;
  }

  // 删除会话
  async deleteConversation(userId: string, conversationId: string) {
    // 调用 Coze API 删除会话逻辑（假设 API 支持此操作）
    await axios.delete(
      `https://api.coze.cn/v1/conversation/${conversationId}`,
      { headers: this.headers },
    );
    // 清理用户的会话记录
    await this.usersService.clearConversationId(userId);
  }

  // 生成消息
  async genMessage(userId: string, message: string) {
    const conversationId = await this.usersService.getConversationId(userId);
    const response = await axios.post(
      'https://api.coze.cn/v1/conversation/message/create',
      { role: 'user', content: message, content_type: 'text' },
      { headers: this.headers, params: { conversation_id: conversationId } },
    );
    return response.data.data.id;
  }

  // 生成对话
  async genChat(userId: string) {
    const conversationId = await this.usersService.getConversationId(userId);
    const response = await axios.post(
      'https://api.coze.cn/v3/chat',
      { bot_id: this.bot_id, user_id: userId },
      { headers: this.headers, params: { conversation_id: conversationId } },
    );
    return response.data.data.id;
  }

  // 对话状态
  async chatRetrieve(userId: string, chatId: string) {
    const conversationId = await this.usersService.getConversationId(userId);
    const response = await axios.get('https://api.coze.cn/v3/chat/retrieve', {
      headers: this.headers,
      params: { conversation_id: conversationId, chat_id: chatId },
    });
    return response.data.data.status;
  }

  // 消息列表
  async chatMessageList(userId: string, chatId: string) {
    const conversationId = await this.usersService.getConversationId(userId);
    const response = await axios.get(
      'https://api.coze.cn/v3/chat/message/list',
      {
        headers: this.headers,
        params: { conversation_id: conversationId, chat_id: chatId },
      },
    );
    return response.data.data;
  }
}
