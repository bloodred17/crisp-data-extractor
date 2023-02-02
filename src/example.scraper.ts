import { executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export const exampleScrape = async (url: string) => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
  });

  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const content = await page.evaluate(() => {
      return document.querySelector('article')?.innerHTML;
    });

    await page?.close();
    await browser?.close();

    return content;
  } catch (e) {
    try {
      await page?.close();
      await browser?.close();
    } catch(err) {
      console.log('Failed to close page and browser. Probably closed');
    }
    throw e;
  }
}
