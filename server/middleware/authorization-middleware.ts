import jwt, { JwtPayload } from "jsonwebtoken";
import { getUser, isTokenInvalid } from "@services/user/user-service";


async function canViewPage(token) {
  const user = await getUser(Number(token.id));
  if (!user) {
    return false;
  }
  return user;
}

function refreshToken(decodedToken, res) {
  delete decodedToken.iat;
  delete decodedToken.exp;
  delete decodedToken.nbf;
  delete decodedToken.jti;

  const token = jwt.sign(decodedToken, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_LENGTH,
  });

  const cookieLength = 24 * 60 * 60 * 1000;

  res.cookie("catshelp", 'true', {
    maxAge: cookieLength,
    httpOnly: false,
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.VITE_ENVIRONMENT !== 'TEST',
    sameSite: "Strict",
    maxAge: cookieLength,
  });
}

function tokenNeedsRefresh(decodedToken) {
  const tokenExpTime = new Date(decodedToken.exp * 1000);
  const difInMilliseconds = new Date().getTime() - tokenExpTime.getTime();
  const refreshTime = 120000; //2 min
  return difInMilliseconds < refreshTime;
}

export async function authenticate(req, res, next) {
  try {
    var decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  } catch (err) {
    res.cookie("jwt", "");
    res.cookie("catshelp", "");
    return res.sendStatus(401);
  }

  if (!decodedToken || await isTokenInvalid(req.cookies.jwt)) {
    res.cookie("jwt", "");
    res.cookie("catshelp", "");
    return res.sendStatus(401);
  }

  if (!await canViewPage(decodedToken)) {
    return res.sendStatus(401);
  }

  if (tokenNeedsRefresh(decodedToken)) {
    refreshToken(decodedToken, res);
  }

  next();
}

export async function getCurrentUser(req) {
  var decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET) as JwtPayload;
  return await getUser(decodedToken.id);
}