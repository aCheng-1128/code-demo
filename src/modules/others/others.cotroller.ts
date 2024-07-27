import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Res,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

// @UseGuards(JwtAuthGuard)
@Controller('others')
export class OthersController {
  @Get('music')
  getMusic(@Res() res: Response): void {
    const filePath = path.join(process.cwd(), 'storage', 'fssx.mp3');
    res.sendFile(filePath);
  }

  @Get('musicLrc')
  getMusicLrc(@Res() res: Response): void {
    const filePath = path.join(process.cwd(), 'public', 'fssx.lrc');
    res.sendFile(filePath);
  }

  @Get('searchFrames')
  searchFrames(
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 12,
  ) {
    const params = {
      _platform: 'web',
      _version: '0.2.5',
      _ts: new Date().getTime(),
      keyword: keyword,
      page: page,
      limit: limit,
    };
    const getSignature = (e: any) => {
      const n =
        Object.keys(e)
          .sort()
          .map((n) => `${n}=${e[n]}`)
          .join(',') + ',';
      return CryptoJS.MD5(n).toString();
    };

    const fetchData = async () => {
      const signature = getSignature(params);
      console.log('params:', params);
      try {
        const response = await axios.get(
          'https://fse-api.agilestudio.cn/api/search',
          {
            params: params,
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Accept-Encoding': 'gzip, deflate, br, zstd',
              'Accept-Language': 'zh-CN,zh;q=0.9',
              Connection: 'keep-alive',
              Host: 'fse-api.agilestudio.cn',
              Origin: 'https://fse.agilestudio.cn',
              Referer: 'https://fse.agilestudio.cn/',
              'Sec-Ch-Ua':
                '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
              'Sec-Ch-Ua-Mobile': '?0',
              'Sec-Ch-Ua-Platform': '"Windows"',
              'Sec-Fetch-Dest': 'empty',
              'Sec-Fetch-Mode': 'cors',
              'Sec-Fetch-Site': 'same-site',
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
              'x-signature': signature,
            },
          },
        );

        return response.data;
      } catch (error) {
        throw new HttpException(
          'Failed to fetch data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    };

    return fetchData();
  }

  // 根据url链接获取网页的html内容
  @Get('getHtml')
  async getHtml(@Query('url') url: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'storage', 'extracted.html');

    if (url) {
      let browser;
      try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Referer: 'https://www.zhipin.com',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
        });
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // 等待特定元素加载完成
        await page.waitForSelector(
          '.job-banner, .job-detail-section, .sider-company',
        );

        const content = await page.content();

        // 使用 cheerio 解析 HTML 内容
        const $ = cheerio.load(content);

        // 提取所需部分的 HTML
        const headerHtml = $('#header').html() || '';
        const jobBannerHtml = $('.job-banner').html() || '';
        const jobDetailSectionHtml = $('.job-detail-section').html() || '';
        const siderCompanyHtml = $('.sider-company').html() || '';
        const signHtml = $('.sign-wrap-v2').html() || '';

        // 对 HTML 内容进行自定义修改，例如添加一个新的元素
        $('.job-banner').append(
          '<div class="custom-element">Custom Content</div>',
        );

        // 提取样式和脚本
        const styles = [];
        const scripts = [];
        $('link[rel="stylesheet"]').each((_, element) => {
          styles.push($(element).attr('href'));
        });
        $('script[src]').each((_, element) => {
          scripts.push($(element).attr('src'));
        });

        const combinedHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Extracted HTML</title>
          ${styles
            .map(
              (href) =>
                `<link href="${href}" type="text/css" rel="stylesheet">`,
            )
            .join('\n')}
        </head>
        <body class="job-body-wrapper" data-pv="cpc_job_detail">
        <div id="header">${headerHtml}</div>
        <div class="main">
            <div class="job-banner">${jobBannerHtml}</div>
            <div class="job-box">
                <div class="inner home-inner">
                    <div class="job-sider">
                        <div class="sign-wrap sign-wrap-v2">${signHtml}</div>
                        <div class="sider-company">${siderCompanyHtml}</div>
                    </div>
                    <div class="job-detail">
                        <div class="job-detail-section">${jobDetailSectionHtml}</div>
                    </div>
                </div>
            </div>
        </div>
          ${scripts.map((src) => `<script src="${src}"></script>`).join('\n')}
        </body>
        </html>
      `;

        // 将 HTML 内容写入文件
        fs.writeFileSync(filePath, combinedHtml, 'utf8');

        // 返回文件给客户端
        res.sendFile(filePath);
      } catch (error) {
        console.error('Error fetching data:', error);
        throw new HttpException(
          'Failed to fetch data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } finally {
        if (browser) {
          await browser.close();
        }
      }
    } else {
      if (fs.existsSync(filePath)) {
        const htmlContent = fs.readFileSync(filePath, 'utf8');
        res.send(htmlContent);
      } else {
        throw new HttpException('HTML file not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  @Post('editHtml')
  async editHtml(@Body() body: any, @Res() res: Response) {
    console.log('editHtml:', body);
    const filePath = path.join(process.cwd(), 'storage', 'extracted.html');
    if (!fs.existsSync(filePath)) {
      throw new HttpException('HTML file not found', HttpStatus.NOT_FOUND);
    }

    const htmlContent = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(htmlContent);

    // 更新 HTML 内容
    if (body.jobTitle) {
      $('h1[title]').text(body.jobTitle).attr('title', body.jobTitle);
    }
    if (body.salary) {
      $('.salary').text(body.salary);
    }
    if (body.benefits) {
      const benefitsArray = body.benefits.split(',');
      $('.job-tags').html(
        benefitsArray.map((benefit) => `<span>${benefit}</span>`).join(''),
      );
    }
    if (body.location) {
      $('.text-city').text(body.location);
    }
    if (body.experience) {
      $('.text-experiece').text(body.experience);
    }
    if (body.degree) {
      $('.text-degree').text(body.degree);
    }
    if (body.keywords) {
      const keywordsArray = body.keywords.split(',');
      $('.job-keyword-list').html(
        keywordsArray.map((keyword) => `<li>${keyword}</li>`).join(''),
      );
    }
    if (body.jobDescription) {
      $('.job-sec-text').html(body.jobDescription.replace(/\n/g, '<br>'));
    }
    if (body.companyName) {
      $('.sider-company .company-info a').last().text(body.companyName);
    }
    if (body.companyStage) {
      $('.sider-company .icon-stage').parent().text(body.companyStage);
    }
    if (body.companySize) {
      $('.sider-company .icon-scale').parent().text(body.companySize);
    }
    if (body.companyIndustry) {
      $('.sider-company .icon-industry a').text(body.companyIndustry);
    }

    // 保存更新后的 HTML
    const updatedHtml = $.html();
    fs.writeFileSync(filePath, updatedHtml, 'utf8');

    // 返回更新后的 HTML
    res.send(updatedHtml);
  }

  @Get('getHtmlAll')
  async getHtmlAll(@Query('url') url: string, @Res() res: Response) {
    if (url) {
      let browser;
      try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
        });
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // 或者等待特定的元素加载完毕
        await page.waitForSelector('body');

        // 获取整个页面的 HTML 内容
        let content = await page.content();

        // 定义你要插入的 CSS 文件链接
        const cssLink = `<link href="/css.css" rel="stylesheet">`;

        // 在<head>标签内插入 CSS 文件链接
        content = content.replace('</head>', `${cssLink}</head>`);

        // 返回 HTML 内容给客户端
        res.send(content);
      } catch (error) {
        console.error('Error fetching data:', error);
        throw new HttpException(
          'Failed to fetch data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } finally {
        if (browser) {
          await browser.close();
        }
      }
    } else {
      throw new HttpException(
        'URL parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 根据链接获取svg图片
  @Get('getSvg')
  async getSvg(@Query('url') url: string, @Res() res: Response) {
    if (url) {
      let browser;
      try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Referer: 'https://www.zhipin.com',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
        });
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // 等待特定元素加载完成
        await page.waitForSelector('svg');

        // 获取svg元素的HTML内容
        const svgContent = await page.$eval(
          'svg',
          (element) => element.outerHTML,
        );

        // 返回svg内容给客户端
        res.send(svgContent);
      } catch (error) {
        console.error('Error fetching data:', error);
        throw new HttpException(
          'Failed to fetch data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } finally {
        if (browser) {
          await browser.close();
        }
      }
    } else {
      throw new HttpException(
        'URL parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('getResumeDoc')
  async getResumeDoc(@Query('url') url: string, @Res() res: Response) {
    // http://localhost:3366/others/getResumeDoc?url=https://zcmima.cn/%23/resume/edit?id=MDAwMDAwMDAwMIO5x9-ydLua%26tzUrl=tem0005%26language=cn%26platform=pluginxfyun%26from=xfspark%26uuid=184abab5-9bd2-42a4-bda4-dfb2084fd69a#/resume/edit?id=MDAwMDAwMDAwMIO5x9-ydLua&tzUrl=tem0005&language=cn&platform=pluginxfyun&from=xfspark&uuid=184abab5-9bd2-42a4-bda4-dfb2084fd69a
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

      // 增加超时时间，确保页面加载完成
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      // 等待特定元素加载完毕
      await page.waitForSelector('#resume_content');

      // 读取本地 CSS 文件
      const cssPath = path.join(process.cwd(), 'storage', 'css.css');
      if (!fs.existsSync(cssPath)) {
        throw new HttpException('CSS file not found', HttpStatus.NOT_FOUND);
      }
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      const cssStyle = `<style>${cssContent}</style>`;

      // 获取指定元素的 HTML 内容
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

      // 设置页面内容为 HTML，并生成 PDF
      await page.setContent(resumeContentHtml, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        timeout: 60000, // 设置生成 PDF 的超时时间
      });

      // 返回 PDF 文件
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      });
      res.send(pdfBuffer);
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
}
