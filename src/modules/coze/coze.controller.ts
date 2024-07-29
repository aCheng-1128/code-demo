import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Delete,
  Param,
  Get,
  Request,
} from '@nestjs/common';
import { Response } from 'express';
import { CozeService } from './coze.service';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';

@Controller('coze')
export class CozeController {
  constructor(private readonly cozeService: CozeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createConversation(@Request() req, @Res() res: Response) {
    const userId = req.user.userId;
    const conversationId = await this.cozeService.genConversation(userId);
    res.json({ conversationId });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:conversationId')
  async deleteConversation(
    @Request() req,
    @Param('conversationId') conversationId: string,
    @Res() res: Response,
  ) {
    const userId = req.user.userId;
    await this.cozeService.deleteConversation(userId, conversationId);
    res.sendStatus(204);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  async sendMessage(
    @Request() req,
    @Body('message') message: string,
    @Res() res: Response,
  ) {
    const userId = req.user.userId;
    const messageId = await this.cozeService.genMessage(userId, message);
    res.json({ messageId });
  }

  @UseGuards(JwtAuthGuard)
  @Post('createChat')
  async createChat(@Request() req, @Res() res: Response) {
    const userId = req.user.userId;
    const chatId = await this.cozeService.genChat(userId);
    res.json({ chatId });
  }

  @UseGuards(JwtAuthGuard)
  @Get('status/:chatId')
  async getChatStatus(
    @Request() req,
    @Param('chatId') chatId: string,
    @Res() res: Response,
  ) {
    const userId = req.user.userId;
    const status = await this.cozeService.chatRetrieve(userId, chatId);
    res.json({ status });
  }

  @UseGuards(JwtAuthGuard)
  @Get('messages/:chatId')
  async getChatMessages(
    @Request() req,
    @Param('chatId') chatId: string,
    @Res() res: Response,
  ) {
    const userId = req.user.userId;
    const messages = await this.cozeService.chatMessageList(userId, chatId);
    res.json({ messages });
  }
}
