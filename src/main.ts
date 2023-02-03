import { crispHelpdeskExtractor } from './crisp.scraper';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { CrispArticle } from './crisp.interface';
import { CrispModel, CrispSchema } from './crisp.schema';

config();

(async () => {
  let dbConnected = false;
  if (process.env.MONGODB_ENDPOINT) {
    await mongoose.connect(
      process.env.MONGODB_ENDPOINT
    );
    dbConnected = true;
  }

  await crispHelpdeskExtractor(async (crispArticle: CrispArticle) => {
    if (dbConnected) {
      const doc = await CrispModel.create(new CrispSchema(crispArticle));
      console.log(doc);
    }
  });
  
  process.exit(0);
})();

