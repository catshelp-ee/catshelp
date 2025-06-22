import NodeCache from "node-cache";
import { prisma } from "server/prisma";
import { User } from "generated/prisma";

const TTLInSeconds = 1200; // Time to live 20 minutes
const cacheStore = new NodeCache({ stdTTL: TTLInSeconds }); 

// Read from persistent cache
async function getPersistentCache(key: string) {
  const now = new Date();
  const cacheEntry = await prisma.cache.findUnique({
    where: { keyName: key },
  });
  if (!cacheEntry || cacheEntry.expiresAt <= now) return null;
  return JSON.parse(cacheEntry.value);
}

// Write/update persistent cache
async function setPersistentCache(key: string, data: any, ttlSeconds: number) {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  await prisma.cache.upsert({
    where: { keyName: key },
    update: { value: JSON.stringify(data), expiresAt },
    create: { keyName: key, value: JSON.stringify(data), expiresAt },
  });
}

export const cacheUser = async (id: number, user: User) => {
  cacheStore.set(id, user);
}

export const getCachedUser = async (id: number): Promise<User> => {
  return cacheStore.get(id);
}

export const cache = async (req, res, next) => {
  const key = req.originalUrl.split("/").filter(Boolean).pop();

  try {
    // 1. Try in-memory cache first
    const cachedMemory = cacheStore.get(key);
    if (cachedMemory) {
      if (typeof cachedMemory === "object" && cachedMemory !== null) {
        cachedMemory._source = "memory-cache";
      }
      return res.json(cachedMemory);
    }

    // 2. Try persistent MySQL cache if no in-memory hit
    const cachedPersistent = await getPersistentCache(key);
    if (cachedPersistent) {
      if (typeof cachedPersistent === "object" && cachedPersistent !== null) {
        cachedPersistent._source = "persistent-cache";
      }
      // Warm up in-memory cache for future requests
      cacheStore.set(key, cachedPersistent);
      return res.json(cachedPersistent);
    }

    // 3. Intercept res.json to cache the response in both caches
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      // Cache in memory
      cacheStore.set(key, body);
      // Cache persistently in DB with a TTL
      await setPersistentCache(key, body, TTLInSeconds);
      return originalJson(body);
    };

    next();
  } catch (err) {
    console.error("Cache middleware error:", err);
    next();
  }
};