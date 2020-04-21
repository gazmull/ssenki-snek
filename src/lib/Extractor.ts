import Balancer from './Downloader/Balancer';
import * as path from 'path';
import { Logger } from 'winston';
import { IConfig } from '../../typings/config';

export default class Extractor {
  constructor (config: IConfig, logger: Logger) {
    this.config = config;

    this.logger = logger;
  }

  config: IConfig;

  logger: Logger;

  async exec () {
    this.logger.info('Extractor started...');

    const result = await new Balancer(this.config).exec();

    this.logger.info('Finished extracting.');

    if (result.some(v => v instanceof Error))
      this.logger.info(`Detected error(s). See ${path.resolve(__dirname, '../../logs')}`);

    throw new Error('Worker error');
  }
}
