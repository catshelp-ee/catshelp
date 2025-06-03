import * as jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { OAuth2Client } from 'google-auth-library';
import { getUserByEmail, setTokenInvalid, isTokenInvalid } from "@services/user-service.ts"
import { sendRequest } from "@services/email-service.ts";

const client = new OAuth2Client();

function setLoginCookies(res, token) {
    res.cookie("catshelp", 'true', {
        httpOnly: false
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.ENVIRONMENT !== 'TEST',
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000,
    });
}

function resetLoginCookies(res) {
    res.cookie("jwt", "");
    res.cookie("catshelp", "");
}

export async function googleLogin(req: any, res: any) {
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

    setLoginCookies(res, token);
    return res.sendStatus(200);
    
};

export async function emailLogin(req: any, res: any) {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
        return res.sendStatus(401);
    }
    await sendRequest(user.id, user.email);
    return res.sendStatus(200);
};

export async function logout(req: any, res: any) {
    const cookie = req.cookies.jwt;
    if (!cookie) {
        return res.sendStatus(200);
    }
    const decoded = jwtDecode(cookie);
    await setTokenInvalid(cookie, decoded);

    resetLoginCookies(res);
    return res.sendStatus(200);
};

export async function verify(req: any, res: any) {
    let token = req.query.token;
    if (token == null) {
        return res.sendStatus(401);
    }
    
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return res.sendStatus(401);
    }

    if (await isTokenInvalid(token)) {
        return res.sendStatus(401);
    }

    await setTokenInvalid(token, decodedToken);
        
    const newToken = jwt.sign({ id: decodedToken.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_LENGTH,
    });

    setLoginCookies(res, newToken);
    return res.redirect("/dashboard");
};