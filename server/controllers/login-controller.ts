import * as jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { OAuth2Client } from 'google-auth-library';
import { getUserByEmail, setTokenInvalid } from "../services/user-service.ts"

const client = new OAuth2Client();

export async function login(req: any, res: any) {
    const { credential, clientId } = req.body;
    var email = null;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: clientId,
        });
        const payload = ticket.getPayload();
        email = payload['email'];
    } catch (err) {
        res.status(400).json({ err });
    }
    
    const user = await getUserByEmail(email);
    if (!user) {
        res.sendStatus(401);
        return;
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_LENGTH,
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.ENVIRONMENT !== 'TEST',
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000,
    });
    return res.sendStatus(200);
    
};

export async function logout(req: any, res: any) {
    const cookie = req.cookies.jwt;
    if (!cookie) {
        return res.sendStatus(200);
    }
    const decoded = jwtDecode(cookie);
    await setTokenInvalid(cookie, decoded);

    res.cookie("jwt", "");
    return res.sendStatus(200);
};

export function verify(req: any, res: any) {
    const token = req.query.token;
    if (token == null) return res.sendStatus(401);
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return res.redirect("/dashboard");
    } catch (e) {
        return res.sendStatus(401);
    }
};