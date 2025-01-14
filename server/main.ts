import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { join } from "@std/path";
import * as animalController from "./controllers/animal-controller.ts";
import * as loginController from "./controllers/login-controller.ts";
import * as dashboardController from "./controllers/dashboard-controller.ts";
import { authenticate } from "./middleware/authorization-middleware.ts";
import db from "../models/index.cjs";

initializeDb()
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Get the equivalent of __dirname
const __filename = new URL(import.meta.url).pathname;
const __dirname = __filename.substring(0, __filename.lastIndexOf("/")); // Get the directory path

app.use("/public", express.static(join(__dirname, "public")));
app.post("/api/animals", authenticate, animalController.postAnimal);
app.post("/api/pilt/lisa", authenticate, animalController.addPicture);
app.post("/api/login", authenticate, loginController.login);
app.get("/api/verify", authenticate, loginController.verify);
app.get("/api/animals/dashboard", authenticate, dashboardController.getDashboard);

app.listen(process.env.BACKEND_PORT, () => {
    console.log("connected to backend!");
});

function initializeDb() {
    // Seda ei tohi eemaldada
    // Mingi fucked magic toimub siin, et peab vähemalt
    // üks kord kutsuma teda, muidu ei toimi
    db;
}
