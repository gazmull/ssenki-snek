import * as OS from 'os';
import * as path from 'path';
import { Worker } from 'worker_threads';
import { IConfig } from '../../../../typings/config';

export default class DownloadBalancer {
  constructor (config: IConfig) {
    this.config = config;
  }

  config: IConfig;

  async exec () {
    const balancedData = this._balanceData(this.config.range);
    const workers = await Promise.all(balancedData.map((v, i) => this._spawnWorker(i, v)));

    return workers as Promise<void | Error>[];
  }

  protected _spawnWorker (id: number, downloads: number[]) {
    return new Promise(resolve => {
      const workerData = { downloads, id, config: this.config };
      const worker = new Worker(path.join(__dirname, 'worker.js'), { workerData });
      let errored = false;

      worker
        .once('message', () => errored = true)
        .once('exit', code => {
          if (code)
            return resolve(new Error(`[worker-${id}] exited as ${code}`));

          resolve(`[worker-${id}] exited ${errored ? 'with error(s)' : 'nicely'}.`);
        });
    });
  }

  protected _balanceData ([ start, end ]: number[]) {
    const cpus = OS.cpus();
    const balancedData = Array.from<unknown, number[]>({ length: cpus.length }, () => []);
    const lastIndex = cpus.length - 1;
    let lastFilled = 0;

    for (let i = start; i <= end; i += 100) {
      if (lastFilled > lastIndex) lastFilled = 0;

      balancedData[lastFilled].push(i);
      lastFilled++;
    }

    return balancedData.filter(e => e.length);
  }
}
