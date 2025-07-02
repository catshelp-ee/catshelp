import NodeCache from "node-cache";
import { prisma } from "server/prisma";
import { User } from "generated/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

const cacheStore = new NodeCache();

async function getPersistentCache(key: string) {
  const cacheEntry = await prisma.cache.findUnique({
    where: { keyName: key },
  });

  if (!cacheEntry){  
    return null;
  } 
  return JSON.parse(cacheEntry.value);
}

async function setPersistentCache(key: string, data: any) {
  await prisma.cache.upsert({
    where: { keyName: key },
    update: { value: JSON.stringify(data) },
    create: { keyName: key, value: JSON.stringify(data) },
  });
}

export const cacheUser = async (id: number, user: User) => {
  cacheStore.set(id, user);
};

export const getCachedUser = async (id: number): Promise<User> => {
  return cacheStore.get(id);
};

export const cache = async (req, res, next) => {
  const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET) as JwtPayload;
  const key = `${decodedToken.id}-${req.originalUrl.split("/").filter(Boolean).pop()}`;

  try {
    const cachedMemory = cacheStore.get(key);
    if (cachedMemory) {
      if (typeof cachedMemory === "object" && cachedMemory !== null) {
        cachedMemory._source = "memory-cache";
      }
      return res.json(cachedMemory);
    }

    const cachedPersistent = await getPersistentCache(key);
    if (cachedPersistent) {
      if (typeof cachedPersistent === "object" && cachedPersistent !== null) {
        cachedPersistent._source = "persistent-cache";
      }
      cacheStore.set(key, cachedPersistent);
      return res.json(cachedPersistent);
    }

    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheStore.set(key, body);
        
        await setPersistentCache(key, body);
      }
      
      return originalJson(body);
    };

    next();
  } catch (err) {
    console.error("Cache middleware error:", err);
    next();
  }
};
