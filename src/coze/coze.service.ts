import { Injectable } from '@nestjs/common';
import axios from 'axios';

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
  private readonly user_id = '7376616099355557922';
  private readonly headers = {
    Authorization: this.authToken,
    'Content-Type': 'application/json',
  };
  private conversation_id = '';
  private message_id = '';
  private chat_id = '';
  public chat_status: ChatStatus = undefined;
  public chat_messages: any = null;

  // 生成会话
  async genConversation() {
    const response = await axios.post(
      'https://api.coze.cn/v1/conversation/create',
      {},
      {
        headers: this.headers,
      },
    );
    console.log('genConversation', response.data.data);
    this.conversation_id = response.data.data.id;
  }
  // 生成消息
  async genMessage(message: string) {
    const response = await axios.post(
      'https://api.coze.cn/v1/conversation/message/create',
      {
        role: 'user',
        content: message,
        content_type: 'text',
      },
      {
        headers: this.headers,
        params: {
          conversation_id: this.conversation_id,
        },
      },
    );
    console.log('genMessage', response.data.data);
    this.message_id = response.data.data.id;
  }
  // 生成对话
  async genChat() {
    const response = await axios.post(
      'https://api.coze.cn/v3/chat',
      {
        bot_id: this.bot_id,
        user_id: this.user_id,
      },
      {
        headers: this.headers,
        params: {
          conversation_id: this.conversation_id,
        },
      },
    );
    console.log('genChat', response.data.data);
    this.chat_id = response.data.data.id;
  }
  // 对话详情 判断对话状态
  async chatRetrieve() {
    const response = await axios.get('https://api.coze.cn/v3/chat/retrieve', {
      headers: this.headers,
      params: {
        conversation_id: this.conversation_id,
        chat_id: this.chat_id,
      },
    });
    console.log('chatRetrieve', response.data.data);
    this.chat_status = response.data.data.status;
  }
  // 对话消息详情
  async chatMessageList() {
    const response = await axios.get(
      'https://api.coze.cn/v3/chat/message/list',
      {
        headers: this.headers,
        params: {
          conversation_id: this.conversation_id,
          chat_id: this.chat_id,
        },
      },
    );
    console.log('chatMessageList', response.data.data);
    this.chat_messages = response.data.data;
  }
}
