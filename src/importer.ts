import fetch from "node-fetch";
import { DataManager } from './dataManager';

const TWITCH_ID = process.env.TWITCH_ID;

export default async function loadData() {

	try {

		const start = Date.now();

		await fetchData();

		console.log(`Fetched new data in ${Date.now() - start}ms`);

	} catch (error) {
		console.log(error);
	}


}

async function fetchData() {
	const res = await get("https://zevent.fr/api/data.json");

	DataManager.setStreamers(await processStreamers(res));
	DataManager.updateStats(res.donationAmount.number, res.viewersCount.number, res.live.filter(l => l.online === true).length);
}

async function processStreamers(res) {
	const lives = [];
	for (let l of res.live) {
		const viewers = l.viewersAmount.number;

		let twitch = l.online ? await getTwitch(
				"https://api.twitch.tv/kraken/streams/" + DataManager.getId(l.twitch)
			) : null;

		delete l.viewersAmount;
		lives.push({
			...l,
			title: l.online ? twitch.stream.channel.status : null,
			viewers: viewers
		});

	}
	return lives.sort((a, b) => b.viewers - a.viewers);
}

async function get(url: string) {
	const res = await fetch(url);
	if (res.ok) {
		return res.json();
	} else {
		console.log(res);
		throw Error(res.statusText);
	}
}

export async function getTwitch(url: string) {
	const res = await fetch(url, {
		headers: {
			Accept: "application/vnd.twitchtv.v5+json",
			"Client-ID": TWITCH_ID
		}
	});
	if (res.ok) {
		return res.json();
	} else {
		console.log(res);
		res.json().then(r => console.log(r));
		throw Error(res.statusText);
	}
}