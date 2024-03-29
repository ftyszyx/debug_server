import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { AppConfig } from 'src/entity/config';

// const isProd = process.env.NODE_ENV === 'production';
export function LoadAppConfig() {
  const node_env = process.env.NODE_ENV;
  const config_path = path.resolve(`config/app.${node_env}.yaml`);
  console.log(`get config from :${config_path}`)
  if (!fs.existsSync(config_path)) {
    throw new Error(`缺少环境配置文件:${config_path}`);
  }
  return yaml.load(fs.readFileSync(config_path, 'utf8')) as AppConfig;
}
