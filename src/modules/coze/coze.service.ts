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

  // 获取用户会话
  async getConversations(userId: string) {
    return this.usersService.getConversations(userId);
  }

  // 创建会话
  async genConversation(userId: string, name = '未命名会话') {
    const response = await axios.post(
      'https://api.coze.cn/v1/conversation/create',
      {},
      { headers: this.headers },
    );
    const conversationId = response.data.data.id;
    await this.usersService.updateConversations(userId, {
      id: conversationId,
      name,
    });
    return conversationId;
  }

  // 查看会话信息
  async getConversationInfo(conversationId: string) {
    const response = await axios.get(
      `https://api.coze.cn/v1/conversation/retrieve?conversation_id=${conversationId}`,
      { headers: this.headers },
    );
    return response.data.data;
  }

  // 删除会话
  async deleteConversation(userId: string) {
    // 清理用户的会话记录
    await this.usersService.clearConversationIds(userId);
  }

  // 创建消息
  async genMessage(conversationId: string, message: string) {
    const response = await axios.post(
      'https://api.coze.cn/v1/conversation/message/create',
      { role: 'user', content: message, content_type: 'text' },
      { headers: this.headers, params: { conversation_id: conversationId } },
    );
    return response.data.data.id;
  }

  // 查看消息列表
  async getMessageList(conversationId: string) {
    const response = await axios.get(
      'https://api.coze.cn/v1/conversation/message/list',
      { headers: this.headers, params: { conversation_id: conversationId } },
    );
    return response.data.data;
  }

  // 查看消息详情
  async getMessageDetail(conversationId: string, messageId: string) {
    const response = await axios.get(
      `https://api.coze.cn/v1/conversation/message/retrieve?conversation_id=${conversationId}&message_id=${messageId}`,
      { headers: this.headers },
    );
    return response.data.data;
  }

  // 发起对话
  async genChat(conversationId: string, userId: string) {
    const response = await axios.post(
      'https://api.coze.cn/v3/chat',
      { bot_id: this.bot_id, user_id: userId },
      { headers: this.headers, params: { conversation_id: conversationId } },
    );
    return response.data.data;
  }

  // 对话状态
  async chatRetrieve(conversationId: string, chatId: string) {
    const response = await axios.get('https://api.coze.cn/v3/chat/retrieve', {
      headers: this.headers,
      params: { conversation_id: conversationId, chat_id: chatId },
    });
    return response.data.data.status;
  }

  // 消息列表
  async chatMessageList(conversationId: string, chatId: string) {
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
