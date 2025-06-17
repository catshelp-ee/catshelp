import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;
const TTL = 60; // seconds

export async function initializeRedis() {
  if (!redisClient) {
    redisClient = createClient();
    redisClient.on("error", (err) => console.error("Redis Client Error", err));
    await redisClient.connect();
  }
}

export const cache = async (req, res, next) => {
  if (!redisClient) {
    console.warn("Redis client not initialized");
    return next();
  }

  const key = req.originalUrl;
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return res.json({ source: "cache", data: JSON.parse(cachedData) });
    }

    // Override res.json to cache response
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      await redisClient.setEx(key, TTL, JSON.stringify(body.data ?? body));
      return originalJson(body);
    };

    next();
  } catch (err) {
    console.error("Redis cache error:", err);
    next();
  }
};
