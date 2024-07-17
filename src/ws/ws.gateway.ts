import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server, WebSocket } from 'ws';
import { OpenAiService } from '../modules/openai/openai.service';

@Injectable()
export class WsGateway implements OnModuleInit {
  private server: Server;
  private clients: Set<WebSocket> = new Set();

  constructor(private readonly openAiService: OpenAiService) {
    console.log('WsGateway created');
  }

  onModuleInit() {
    this.server = new Server({
      port: 3001,
      path: '/openai',
    });

    this.server.on('connection', (client: WebSocket) => {
      this.clients.add(client);
      console.log('Client connected');

      client.on('message', (message: string) =>
        this.handleMessage(message, client),
      );
      client.on('close', () => this.handleDisconnect(client));
      client.on('error', (error: Error) =>
        console.error('WebSocket error:', error),
      );
    });

    console.log('WebSocket server initialized');
  }

  handleDisconnect(client: WebSocket) {
    this.clients.delete(client);
    console.log('Client disconnected');
  }

  async handleMessage(message: string, client: WebSocket): Promise<void> {
    console.log('Received message:', message);

    let response = 'No response';

    try {
      response = await this.openAiService.getResponse(message);
    } catch (error) {
      console.error('Error while getting response from OpenAI:', error);
    } finally {
      this.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(response);
        }
      });
    }
  }
}
