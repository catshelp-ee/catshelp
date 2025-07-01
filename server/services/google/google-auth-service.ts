import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { injectable } from "inversify";

@injectable()
export default class GoogleAuthService {
    private client: any;

    constructor(client: any){
        this.client = client;
    }

    static async create(){
        const isProd = process.env.NODE_ENV === "production";

        const keyFilePath = isProd
        ? "../credentials.json"
        : "credentials.json";
        
        const auth = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
        scopes: ["https://www.googleapis.com/auth/drive"],
        });
        
        const client = await auth.getClient() as OAuth2Client;

        return new GoogleAuthService(client)
    }

    getAuth(){
        return this.client;
    }
}