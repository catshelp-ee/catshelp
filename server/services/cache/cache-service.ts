import { inject, injectable } from "inversify";
import NodeCache from "node-cache";

@injectable() 
export default class NodeCacheService {
  private cache = new NodeCache({ stdTTL: 3600 });
  
  async get<T>(key: string): Promise<T | null> {
    return this.cache.get<T>(key) || null;
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    this.cache.set(key, value, ttl);
  }
  
  async del(key: string): Promise<void> {
    this.cache.del(key);
  }
}