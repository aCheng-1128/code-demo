import { Injectable } from '@nestjs/common';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class CsvService {
  async parseCsv(data: string): Promise<any[]> {
    const results = [];
    return new Promise((resolve, reject) => {
      const stream = Readable.from(data);
      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
