import express from "express";
import { config } from "dotenv";
import helmet from "helmet";
import { DataManager } from './dataManager';

config();

const PORT = parseInt(process.env.PORT)

const app = express();

export default () => new Promise((resolve, reject) => {

	app.use(helmet());

	app.get("/stats", (req, res) => res.send(DataManager.getStats()));
	app.get("/streamers", (req, res) => res.send(DataManager.getStreamers()));
	app.get("/games", (req, res) => res.send(DataManager.getGames()));

	app.get("/twitchOAuth", (req, res) => {
		console.log(req);
	});

	app.listen(PORT, "localhost", () => resolve());
});
