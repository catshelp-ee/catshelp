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
      const parsed = JSON.parse(cachedData);

      // Inject metadata without altering shape
      if (typeof parsed === "object" && parsed !== null) {
        parsed._source = "cache";
      }

      return res.json(parsed);
    }

    // Intercept res.json to cache the actual response
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      await redisClient.setEx(key, TTL, JSON.stringify(body));
      return originalJson(body);
    };

    next();
  } catch (err) {
    console.error("Redis cache error:", err);
    next();
  }
};
