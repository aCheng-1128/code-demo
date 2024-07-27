import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { renderToString } from 'vue/server-renderer';
import { createApp } from '../../../public/app';

@Controller('ssr')
export class SsrController {
  @Get('/')
  async renderVueApp(@Res() res: Response) {
    const app = createApp();

    try {
      const html = await renderToString(app);
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Vue SSR Example</title>
            <script type="importmap">
              {
                "imports": {
                  "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
                }
              }
            </script>
            <script type="module" src="/client.js"></script>
          </head>
          <body>
            <div id="app">${html}</div>
          </body>
        </html>
      `);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }
}
