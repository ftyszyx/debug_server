import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManger: Cache,
  ) {}
  async get<T>(key: string): Promise<T> {
    return await this.cacheManger.get(key);
  }
  async set(key: string, value: any, ttl?: number): Promise<void> {
    return await this.cacheManger.set(key, value, ttl);
  }
  async del(key: string): Promise<void> {
    return await this.cacheManger.del(key);
  }
}
