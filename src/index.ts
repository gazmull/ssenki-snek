import Winston from '@gazmull/logger';
import Extractor from './lib/Extractor';
import GetConfig from './lib/Util/GetConfig';

const logger = new Winston('snek').logger;
let code = 0;

(async () => {
  const cfg = await GetConfig();
  const extractor = new Extractor(cfg, logger);

  await extractor.exec();
})()
  .catch(() => code = 1)
  .finally(() => {
    logger.info('Finished.');

    process.exit(code);
  });
