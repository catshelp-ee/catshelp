import db from "../../models/index.cjs";

export async function getUserByEmail(email) {
  if (!email) {
    return null;
  }
  const user = await db.User.findOne({
    where: {
      email: email,
    },
  });
  if (user == null) {
    return null;
  }
  return user;
}

export async function getUserById(id) {
  if (!id) {
    return null;
  }
  const user = await db.User.findByPk(id);
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
  const fosterhome = await db.FosterHome.findOne({
    where: {
      user_id: user.id,
    },
  });
  const fosterhomeCats = await db.AnimalToFosterHome.findAll({
    where: {
      foster_home_id: fosterhome.id,
    },
  });

  const cats = await Promise.all(
    fosterhomeCats.map(async (fosterhomeCat) => {
      return await db.Animal.findByPk(fosterhomeCat.animalId);
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

  await db.RevokedToken.findOrCreate({
    where: {
      token: token,
      expiresAt: date,
    },
  });
}

export async function isTokenInvalid(token) {
  if (!token) {
    return true;
  }
  const { count } = await db.RevokedToken.findAndCountAll({
    where: {
      token: token,
    },
  });
  return count > 0;
}
