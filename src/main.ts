import { crispExtractor } from './crisp.scraper';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { intercomMigrate } from './intercom.migration';
import { CrispArticle } from './crisp.interface';
config();

(async () => {
  await mongoose.connect(
    process.env.MONGODB_ENDPOINT || 'mongodb://localhost:27017/crisp'
  );
  await crispExtractor({ hook: (crispArticle: CrispArticle) => intercomMigrate(crispArticle)});
  process.exit(0);
})();

