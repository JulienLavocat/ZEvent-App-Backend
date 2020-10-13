import api from "./api";
import loadData from './importer';
import { DataManager } from './dataManager';

const FETCH_INTERVAL = parseInt(process.env.FETCH_INTERVAL) * 1000;

async function start() {

	DataManager.loadIds();

	await loadData();

	setInterval(() => loadData(), FETCH_INTERVAL);

	await api();
	console.log(`Listenning on port ${process.env.PORT}`);
}

start();