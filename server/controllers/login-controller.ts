import * as jwt from "jsonwebtoken";
import * as utils from "../utils/utils.ts";

export function login (req: any, res: any) {
    const body = req.body;
    const id = body.id;
    const email = body.email;
    console.log(email);
    utils.sendRequest(id, email);
    res.json("Success");
};

export function verify (req: any, res: any) {
    const token = req.query.token;
    if (token == null) return res.sendStatus(401);
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return res.redirect("/dashboard");
    } catch (e) {
        res.sendStatus(401);
    }
};