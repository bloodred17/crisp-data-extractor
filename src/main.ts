import { exampleScrape } from './example.scraper'


(async () => {

  const data = await exampleScrape();
  console.log(data);

})()
