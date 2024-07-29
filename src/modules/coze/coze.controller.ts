import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  Get,
  Request,
  Query,
} from '@nestjs/common';
import { CozeService } from './coze.service';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';

@Controller('coze')
@UseGuards(JwtAuthGuard)
export class CozeController {
  constructor(private readonly cozeService: CozeService) {}

  // 生成会话
  @Post('create')
  async createConversation(@Request() req) {
    const userId = req.user.userId;
    const conversationIds = await this.cozeService.getConversationIds(userId);
    if (conversationIds.length) {
      return {
        data: { conversationIds },
        msg: '会话已获取成功',
      };
    } else {
      const conversationId = await this.cozeService.genConversation(userId);
      return {
        data: { conversationIds: [conversationId] },
        msg: '新会话创建成功',
      };
    }
  }

  // 查看会话信息
  @Get('info/:conversationId')
  async getConversationInfo(@Param('conversationId') conversationId: string) {
    const conversationInfo = await this.cozeService.getConversationInfo(
      conversationId,
    );
    return {
      data: { conversationInfo },
      msg: '会话信息获取成功',
    };
  }

  // 删除会话
  @Delete('delete')
  async deleteConversation(@Request() req) {
    const userId = req.user.userId;
    await this.cozeService.deleteConversation(userId);
    return { data: null, msg: '会话删除成功' };
  }

  // 创建消息
  @Post('genMessage')
  async genMessage(
    @Body('conversationId') conversationId: string,
    @Body('message') message: string,
  ) {
    const messageId = await this.cozeService.genMessage(
      conversationId,
      message,
    );
    return { data: { messageId }, msg: '消息发送成功' };
  }

  // 查看消息列表
  @Get('messageList')
  async getMessageList(@Query('conversationId') conversationId: string) {
    const messages = await this.cozeService.getMessageList(conversationId);
    return { data: { messages }, msg: '消息列表获取成功' };
  }

  // 查看消息详情
  @Get('message')
  async getMessageDetail(
    @Param('messageId') messageId: string,
    @Param('conversationId') conversationId: string,
  ) {
    const message = await this.cozeService.getMessageDetail(
      conversationId,
      messageId,
    );
    return { data: { message }, msg: '消息详情获取成功' };
  }

  // 创建聊天
  @Post('genChat')
  async genChat(
    @Request() req,
    @Body('conversationId') conversationId: string,
  ) {
    const userId = req.user.userId;
    const response = await this.cozeService.genChat(conversationId, userId);
    return { data: response, msg: '聊天创建成功' };
  }

  // 查看聊天状态
  @Get('status')
  async getChatStatus(
    @Query('conversationId') conversationId,
    @Query('chatId') chatId: string,
  ) {
    const status = await this.cozeService.chatRetrieve(conversationId, chatId);
    return { data: { status }, msg: '聊天状态获取成功' };
  }

  // 查看聊天消息
  @Get('messages')
  async getChatMessages(
    @Query('conversationId') conversationId: string,
    @Query('chatId') chatId: string,
  ) {
    const messages = await this.cozeService.chatMessageList(
      conversationId,
      chatId,
    );
    console.log('messages', messages);
    return { data: messages, msg: '聊天消息获取成功' };
  }

  // 发送聊天消息
  @Post('sendMsg')
  async sendChatMessage(
    @Request() req,
    @Body('conversationId') conversationId: string,
    @Body('message') message: string,
  ) {
    const userId = req.user.userId;
    const chat_id = await this.cozeService.genMessage(conversationId, message);
    const response = await this.cozeService.genChat(conversationId, userId);
    return { data: { ...response, chat_id }, msg: '聊天消息发送成功' };
  }
}
