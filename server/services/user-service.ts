import { cacheUser, getCachedUser } from "@middleware/caching-middleware";
import { prisma } from "../prisma";

export async function getUser(id: number) {
  let user = await getCachedUser(id);
  if (!user){
    user = await getUserById(id);
    await cacheUser(id, user);
    return user;
  }
  return user;
}

export async function getUserByEmail(email) {
  if (!email) {
    return null;
  }
  
  const user = await prisma.user.findFirst({
    where: {email: email},
  });

  if (user == null) {
    return null;
  }

  return user;
}

async function getUserById(id) {
  if (!id) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: {id: id}
  });

  if (user == null) {
    return null;
  }
  return user;
}

export async function setTokenInvalid(token, decodedToken) {
  if (!token) {
    return null;
  }
  const date = new Date(0);
  date.setUTCSeconds(decodedToken.exp);

  const existing = await prisma.revokedToken.findFirst({
    where: {
      token: token,
      expiresAt: date,
    },
  });

  const result = existing ?? await prisma.revokedToken.create({
    data: {
      token: token,
      expiresAt: date,
    },
  });

}

export async function isTokenInvalid(token) {
  if (!token) {
    return true;
  }

  const [items, count] = await prisma.$transaction([
    prisma.revokedToken.findMany({
      where: {
        token: token,
      },
    }),
    prisma.revokedToken.count({
      where: {
        token: token,
      },
    }),
  ]);

  return count > 0;
}