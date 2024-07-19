import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WenxinService {
  private readonly AK: string;
  private readonly SK: string;
  private readonly apiUrl =
    'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-speed-128k';

  constructor(private configService: ConfigService) {
    this.AK = this.configService.get<string>('WENXIN_API_KEY');
    this.SK = this.configService.get<string>('WENXIN_SECRET_KEY');
  }

  async getAccessToken(): Promise<string> {
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.AK}&client_secret=${this.SK}`;
    try {
      const response = await axios.post(url);
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new HttpException(
        'Failed to get access token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async callApi(data: any): Promise<any> {
    const accessToken = await this.getAccessToken();
    const url = `${this.apiUrl}?access_token=${accessToken}`;
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        'Error calling API:',
        error.response ? error.response.data : error.message,
      );
      throw new HttpException(
        'API call failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
