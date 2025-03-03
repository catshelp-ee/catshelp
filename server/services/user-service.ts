import db from "../../models/index.cjs";

export async function getUserByEmail(email) {
    if (!email) {
        return null;
    }
    const user = await db.User.findOne({
        where: {
            email: email
        }
    })
    if (user == null) {
        return null;
    }
    return user;
};

export async function getUserById(id) {
    if (!id) {
        return null;
    }
    const user = await db.User.findByPk(id)
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

    await db.InvalidToken.findOrCreate({
        where: {
            token: token,
            expiresAt: date
        }
    });
}

export async function isTokenInvalid(token) {
    if (!token) {
        return true;
    }
    const { count } = await db.InvalidToken.findAndCountAll({
        where: {
            token: token
        }
    })
    return count > 0;
}