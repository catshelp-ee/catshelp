import * as jwt from "jsonwebtoken";
import { getUserById, isTokenInvalid } from "../services/user-service.ts";

async function canViewPage(token){
  const user = await getUserById(token.id);
  if (!user) {
    return false;
  }
  return user;
}

export async function authenticate(req, res, next) {
  var decodedToken = null;
  try {
    decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  } catch (err) {
    res.cookie("jwt", "");
    return res.sendStatus(401);
  }

  if (await isTokenInvalid(req.cookies.jwt)) {
    res.cookie("jwt", "");
    return res.sendStatus(401);
  }

  if(!decodedToken || !await canViewPage(decodedToken)){
    return res.sendStatus(401);
  }
  
  next();
}
