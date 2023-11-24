import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { AppConfig } from 'src/entity/other';

// const isProd = process.env.NODE_ENV === 'production';
export function LoadAppConfig() {
  const node_env = process.env.NODE_ENV;
  // console.log('node env:', node_env);
  const config_path = path.resolve(`config/app.${node_env}.yaml`);
  if (!fs.existsSync(config_path)) {
    throw new Error('缺少环境配置文件');
  }
  return yaml.load(fs.readFileSync(config_path, 'utf8')) as AppConfig;
}
