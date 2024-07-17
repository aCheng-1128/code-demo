import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { OpenAiService } from '../modules/openai/openai.service';
import { Inject } from '@nestjs/common';
import { RateLimitError } from 'openai';

@WebSocketGateway({ namespace: 'ws', transports: ['websocket'] })
export class WsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  private clients: WebSocket[] = [];

  constructor(
    @Inject(OpenAiService) private readonly openAiService: OpenAiService,
  ) {
    console.log('WsGateway created');
  }

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: WebSocket) {
    this.clients.push(client);
    console.log('Client connected');

    client.on('close', () => this.handleDisconnect(client));
    client.on('error', (error) => console.error('WebSocket error:', error));
  }

  handleDisconnect(client: WebSocket) {
    const index = this.clients.indexOf(client);
    if (index !== -1) {
      this.clients.splice(index, 1);
    }
    console.log('Client disconnected');
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: string): Promise<void> {
    console.log('Received message:', message);
    try {
      const response = await this.openAiService.getResponse(message);
      this.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(response);
        }
      });
    } catch (error) {
      if (error instanceof RateLimitError) {
        console.error(
          'Rate limit exceeded. Please check your quota and billing details.',
        );
        this.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send('Rate limit exceeded. Please try again later.');
          }
        });
      } else {
        console.error('Error while getting response from OpenAI:', error);
      }
    }
  }
}
