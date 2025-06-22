import { getUser } from "@services/user-service";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function getUserData (req: any, res: any) {
    const token = req.cookies.jwt;
    if (token == null) {
        return res.sendStatus(401);
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    const user = await getUser(decodedToken.id);
    res.json(user);
};
