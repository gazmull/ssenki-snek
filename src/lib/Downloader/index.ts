import Axios from 'axios';
import { IOptions } from 'Downloader';
import * as fs from 'fs-nextra';

export default class Downloader {
  constructor (options?: IOptions) {
    this.options = options;
  }

  options: IOptions;

  /* async exec () {
    const urls = this.options.urls;
    const validURLs = this.options.urls?.length && Array.isArray(this.options.urls);

    if (!validURLs) throw { code: 'NOURI', message: 'No URL(s) provided.' };

    const mapped = () => urls.map(
      u =>
        Downloader.axios.get(u)
          .then(r => {
            if (!this.options.callback) return undefined;

            const mimeType = r.headers['content-type'] as string;
            const description: IFile = {
              data: r.data,
              encoding: mimeType.startsWith('text') ? 'utf8' : 'binary',
              mimeType,
              name: r.config.url.split('/').pop()
            };

            return this.options.callback(description);
          })
          .catch(err => err)
    );

    try {
      if (!this.options.stopOnError)
        await Axios.all(mapped());
      else {
      }

      return 0;
    } catch (err) { throw { code: 'EXEC', message: err.message }; }
  } */

  static async exists (filepath: string) {
    try {
      await fs.stat(filepath);

      return true;
    } catch { return false; }
  }

  static async isOK (url: string) {
    try {
      await Axios.head(url, { headers: Downloader.headers, timeout: 5e3 });

      return true;
    } catch (err) { return false; }
  }

  static get axios () {
    return Axios.create({
      method: 'GET',
      headers: Downloader.headers,
      responseType: 'arraybuffer',
      timeout: 6e3
    });
  }

  static get headers () {
    return {
      'user-agent': [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'AppleWebKit/537.36 (KHTML, like Gecko)',
        'Chrome/76.0.3809.100 Safari/537.36',
      ].join(' ')
    };
  }
}
