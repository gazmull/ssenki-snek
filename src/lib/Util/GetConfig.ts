import * as fs from 'fs-nextra';
import * as YAML from 'yaml';
import * as path from 'path';
import { IConfig } from 'config';

export default async function () {
  const file = await fs.readFile(path.join(__dirname, '../../../', 'config.yaml'));
  const parsed = YAML.parse(file.toString()) as IConfig;

  return parsed;
}
