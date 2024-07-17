import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

const AK = '';
const SK = '';

@Injectable()
export class WenxinService {
  private readonly apiUrl =
    'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/image2text/fuyu_8b';

  async getAccessToken(): Promise<string> {
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`;
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
