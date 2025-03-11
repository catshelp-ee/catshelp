import { getUserById } from "../services/user-service.ts";
import * as jwt from "jsonwebtoken";

export async function getUserData (req: any, res: any) {
    const token = req.cookies.jwt;
    if (token == null) {
        return res.sendStatus(401);
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserById(decodedToken.id);
    res.json(user);
};
