import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ResumeService {
  async generateResumePDF(url: string): Promise<Buffer> {
    if (!url) {
      throw new HttpException(
        'URL parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    let browser;
    try {
      browser = await puppeteer.launch({
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setExtraHTTPHeaders({
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
      });

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await page.waitForSelector('#resume_content');

      const cssPath = path.join(process.cwd(), 'storage', 'css.css');
      if (!fs.existsSync(cssPath)) {
        throw new HttpException('CSS file not found', HttpStatus.NOT_FOUND);
      }
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      const cssStyle = `<style>${cssContent}</style>`;

      const resumeContent = await page.$eval(
        '#resumeContainer',
        (element) => element.outerHTML,
      );

      const resumeContentHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Resume Content</title>
          ${cssStyle}
        </head>
        <body>
          ${resumeContent}
        </body>
        </html>
      `;

      await page.setContent(resumeContentHtml, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        timeout: 60000,
      });

      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new HttpException(
        'Failed to generate PDF',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async generateResumePng(url: string): Promise<Buffer> {
    if (!url) {
      throw new HttpException(
        'URL parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    let browser;
    try {
      browser = await puppeteer.launch({
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setExtraHTTPHeaders({
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
      });

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await page.waitForSelector('#resume_content');

      const cssPath = path.join(process.cwd(), 'storage', 'css.css');
      if (!fs.existsSync(cssPath)) {
        throw new HttpException('CSS file not found', HttpStatus.NOT_FOUND);
      }
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      const cssStyle = `<style>${cssContent}</style>`;

      const resumeContent = await page.$eval(
        '#resumeContainer',
        (element) => element.outerHTML,
      );

      const resumeContentHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Resume Content</title>
          ${cssStyle}
        </head>
        <body>
          ${resumeContent}
        </body>
        </html>
      `;

      await page.setContent(resumeContentHtml, { waitUntil: 'networkidle0' });
      const pngBuffer = await page.screenshot({
        type: 'png',
        fullPage: true,
        timeout: 60000,
      });

      return pngBuffer;
    } catch (error) {
      console.error('Error generating PNG:', error);
      throw new HttpException(
        'Failed to generate PNG',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
