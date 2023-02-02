import { crispExtractor } from './crisp.scraper';
import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

(async () => {
  await mongoose.connect(
    process.env.MONGODB_ENDPOINT || 'mongodb://localhost:27017/crisp'
  );
  await crispExtractor();
  process.exit(0);
})();
