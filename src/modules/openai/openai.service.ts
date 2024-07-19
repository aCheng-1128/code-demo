import { HttpsProxyAgent } from 'https-proxy-agent';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private readonly openaiKey: string;
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openaiKey = this.configService.get<string>('OPENAI_API_KEY');
    const proxy = 'http://localhost:7890';
    const agent = new HttpsProxyAgent(proxy);

    try {
      this.openai = new OpenAI({
        apiKey: this.openaiKey,
        httpAgent: agent,
      });
    } catch (e) {
      void e;
    }
  }

  async getResponse(content: string): Promise<string> {
    try {
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content }],
        stream: true,
      });

      const results = [];
      for await (const chunk of stream) {
        console.log('Received chunk:', chunk);
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          results.push(content);
        }
      }
      return results.join('');
    } catch (error) {
      throw new Error('Failed to get response from OpenAI');
    }
  }
}
