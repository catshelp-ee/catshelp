import { prisma } from "../prisma";

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

  try {

    await prisma.user.create({
      data: {
        fullName: "test",
        email: "markopeedosk@gmail.com",
        identityCode: "123",
        citizenship: "a",
        blacklisted: false,
        blacklistedReason: "none"
      }
    })
  } catch(e){
    console.log(e);
  }

  return user;
}
export async function getUserById(id) {
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

export async function getUserCats(email) {
  if (!email) {
    return null;
  }

  const user = await getUserByEmail(email);
  const fosterhome = await prisma.fosterHome.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!fosterhome) {
    return [];
  }
  
  const fosterhomeCats = await prisma.animalToFosterHome.findMany({
    where: {
      fosterHomeId: fosterhome.id,
    },
  });

  const cats = await Promise.all(
    fosterhomeCats.map(async (fosterhomeCat) => {
      return await prisma.animal.findUnique({
        where:{
          id: fosterhomeCat.animalId
        }
      });
    })
  );

  return cats;
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