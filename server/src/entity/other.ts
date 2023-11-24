export interface AppDbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}
export interface AppHttpConfig {
  host: string;
  port: number;
  token_secret_key: string;
  // token_expire_time: string;
  token_expire_in: number;
}
export interface AppRedisConfig {
  host: string;
  port: number;
  db: string;
  password: string;
  ttl: number;
}
export interface AppDetailConfig {
  password_init: string;
}
export interface AppConfig {
  app: AppDetailConfig;
  http: AppHttpConfig;
  db: AppDbConfig;
  redis: AppRedisConfig;
}
