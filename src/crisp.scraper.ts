import puppeteer, { executablePath, HandleFor, HTTPResponse } from 'puppeteer';
import { Crisp, CrispArticle, CrispResponse } from './crisp.interface';
import { delay, interceptor } from './scraping-util';
import { config } from 'dotenv';
import { CrispModel, CrispSchema } from './crisp.schema';
config();

const ORG_ID = process.env.ORG_ID;
export const crispExtractor = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
  });

  const page = await browser.newPage();

  try {
    const url = `https://app.crisp.chat/website/${ORG_ID}/helpdesk/articles`;
    await page.goto(url, { waitUntil: 'networkidle0' });

    await page.type('input[name="email"]', process.env.USERNAME || 'username', {
      delay: 40,
    });
    await delay(1000);
    await page.type(
      'input[name="password"]',
      process.env.PASSWORD || 'password',
      { delay: 40 }
    );

    const articles: Crisp[] = [];
    page.on('response', async (response: HTTPResponse) => {
      if (
        response
          ?.request()
          ?.url()
          ?.includes(
            `https://app.crisp.chat/api/v1/website/${ORG_ID}/helpdesk/locale/en/articles/1`
          )
      ) {
        const { data } = await response.json();
        for (const article of data) {
          articles.push(article);
        }
      }
    });

    const [button] = (await page.$x(
      '//button[contains(.,"Sign in to Dashboard")]'
    )) as [HandleFor<HTMLElement>];
    await button.click();

    await page.waitForNetworkIdle({ idleTime: 5000 });
    // console.log(articles);

    const crispArticles: CrispArticle[] = [];
    for await (const article of articles) {
      const intercepted = interceptor(
        page,
        article?.article_id as string,
        'json',
        25_000,
        [
          (response: HTTPResponse) =>
            response?.request()?.url() ===
            `https://app.crisp.chat/api/v1/website/${ORG_ID}/helpdesk/locale/en/article/${article?.article_id}`,
          (response: HTTPResponse) => response?.request()?.method() === 'GET',
          (response: HTTPResponse) => response?.status() === 200,
        ]
      );

      await page.goto(url + '/en/' + article?.article_id, {
        waitUntil: 'networkidle0',
      });
      const { data } = (await intercepted) as CrispResponse;

      if (data) {
        const newPage = await browser.newPage();
        try {
          await newPage.goto(data?.url as string, {
            waitUntil: 'networkidle0',
          });

          data.html = await newPage.evaluate(
            () => document.querySelector('[role="article"]')?.innerHTML
          );
          data.category = article?.category;

          crispArticles.push(data);
          const doc = await CrispModel.create(new CrispSchema(data));
          console.log(doc);

          await newPage?.close();
        } catch (e) {
          console.log(e);
          try {
            await newPage?.close();
          } catch (e) {}
        }
      }
    }

    await page?.close();
    await browser?.close();

    return crispArticles;
  } catch (e) {
    console.log(e);
    try {
      await page?.close();
      await browser?.close();
    } catch (err) {
      console.log('Failed to close page and browser. Probably closed');
    }
    throw e;
  }
};
