import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { delay } from './scraping-util';

puppeteer.use(StealthPlugin());

export const exampleScrape = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();

  try {
    await page.goto('https://example.com');
    await delay(5000);
    const title = await page.evaluate(() => {
      return document.querySelector('h1')?.innerText;
    });

    await page?.close();
    await browser?.close();

    return title;
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
