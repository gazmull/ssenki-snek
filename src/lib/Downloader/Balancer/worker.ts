import Downloader from '..';
import Winston from '@gazmull/logger';
import { exec } from 'child_process';
import del from 'del';
import * as fs from 'fs-nextra';
import path from 'path';
import { promisify } from 'util';
import { workerData as wd } from 'worker_threads';
import { IConfig } from '../../../../typings/config';
import Constants from '../../Util/Constants';

const childExec = promisify(exec);

const workerData: IWorkerData = wd;
const logger = new Winston(`worker.${workerData.id}`, `[worker-${workerData.id}]`).logger;

let error = false;

async function start (data: IWorkerData) {
  const sequences = Constants.SEQUENCES;
  const { config, downloads } = data;
  const verbose = config.verbose;

  // Search each character
  for (const chara of downloads) {
    logger.info(`Extracting ${chara}...`);

    // Character's scenes
    const predictions = [ chara + 1, chara + 2 ];

    // Check if the character + scene exists
    // If not, skip character
    for (const p of predictions) {
      const isOK = await Downloader.isOK(formatURL(p, sequences[0], 1));

      if (!isOK) {
        logger.warn(`Stopped extracting ${chara}.`);

        break;
      }

      logger.info(`Extracting ${chara}-${p}...`);

      // Download sequences
      for (const seq of sequences) {
        const images: string[] = [];
        const { destination, foldered } = config;
        const charaDir = path.resolve(destination, foldered ? String(chara) : '');
        const mp4Path = path.join(charaDir, formatURL(p, seq));
        const mp4Exists = await Downloader.exists(mp4Path);
        let loopInterrupted = false;

        if (mp4Exists) {
          if (verbose) logger.warn(`${p}-${seq} mp4 exists...`);

          continue;
        }

        // Break download once first URL returns bad HTTP status
        for (let i = 1; i <= 150; i++) {
          const formatted = (fileNameOnly?: boolean) => formatURL(p, seq, i, fileNameOnly);
          const fileName = formatted(true);
          const filePath = path.join(charaDir, fileName);

          // if (verbose) logger.info(`${formatted()} | ${fileName} | ${filePath}`);

          const fileExists = await Downloader.exists(filePath);

          if (fileExists) {
            if (verbose) logger.warn(`${fileName} exists...`);

            images.push(filePath);

            continue;
          }

          if (verbose) logger.info(`Downloading ${fileName}...`);

          try {
            const file = await Downloader.axios.get<Buffer>(formatted());

            await fs.outputFile(filePath, file.data, { encoding: 'binary' });
            images.push(filePath);

            if (verbose) logger.info(`${fileName} saved.`);
          } catch (err) {
            if (err.response) {
              if (verbose) logger.warn(`${fileName} End of sequence...`);

              break;
            }

            error = true;
            loopInterrupted = true;

            logger.error(`${fileName} cannot save: ${err.message}`);

            break;
          }
        }

        // Process to mp4 if sequence type is 'idle', 'easy', 'hard', or 'continue'
        if (!loopInterrupted && sequences.slice(0, -1).includes(seq)) {
          if (verbose) logger.info(`Converting ${p}-${seq} to mp4...`);

          try {
            const matched = (matcher: string) => formatURL(p, seq, 1337, true).replace('1337', matcher);
            const mp4Name = formatURL(p, seq);
            const { stderr } = await childExec([
              ffmpegSource(),
              '-hide_banner',
              '-loglevel panic',
              '-framerate 30',
              '-start_number 1',
              `-i ${matched('%d')}`,
              '-y',
              '-pix_fmt yuv420p',
              '-s 1136x640',
              mp4Name,
            ].join(' '), {
              cwd: charaDir
            });

            if (stderr) throw new Error(stderr);

            await del(matched('*'), { cwd: charaDir });

            if (verbose) logger.info(`${mp4Name} saved.`);
          } catch (err) {
            error = true;

            logger.error(`${p}-${seq} failed convert: ${err.message}`);
          }
        }
      }
    }
  }
}

function ffmpegSource (): string {
  try {
    const ffmpegPath = require('ffmpeg-static');

    return ffmpegPath;
  } catch { return 'ffmpeg'; }
}

function formatURL (prediction: number, sequence: string, number?: number, fileNameOnly?: boolean) {
  const index = (seq: string) => Constants.SEQUENCES.indexOf(seq);

  // For MP4 files
  if (!number) return `${prediction}-${index(sequence)}-${sequence}.mp4`;

  const fileName = (online?: boolean) => `${prediction}${online ? '' : `-${index(sequence)}`}-${sequence}_${number}.jpg`;

  return fileNameOnly
    ? fileName()
    : `${Constants.ROOT_URL}${prediction}/${fileName(true)}`;
}

let code = 0;

start(workerData)
  .then(() => code = error ? 1 : 0)
  .catch(() => code = 1)
  .finally(() => process.exit(code));

interface IWorkerData { id: string; downloads: number[]; config: IConfig; }
