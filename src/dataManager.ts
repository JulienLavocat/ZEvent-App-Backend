import data from "./newChannels.json";

export class DataManager {
	private static stats = {};
	private static streamers = [];
	private static games: { [key: string]: number } = {};
	private static ids: { [key: string]: string } = {};

	static getStreamers() {
		return this.streamers;
	}
	static getStats() {
		return this.stats;
	}
	static getGames() {
		return this.games;
	}
	static getIds() {
		return this.ids;
	}
	static getId(login: string) {
		return this.ids[login];
	}

	static setStreamers(streamers: any) {
		this.streamers = streamers;
		this.processGames();
	}

	static updateStats(donations: number, viewersCount: number, onlineStreams: number) {
		this.stats = {
			donations,
			viewersCount,
			onlineStreams,
			mostWatchedGame: this.getMostWatchedGame(),
			mostWatchedChannel: this.getMostWatchedChannel()
		}
	}


	static loadIds() {
		data.forEach((c) => (this.ids[c.name] = c._id));
	}

	private static processGames() {
		const games: any = {};
		this.streamers.forEach(
			(l) =>
				(games[l.game] = !games[l.game]
					? l.viewers
					: (games[l.game] += l.viewers))
		);
		delete games.Offline;
		this.games = games;
	}

	private static getMostWatchedGame() {
		let mostWatchedGame = "";
		let lastAmount = -1;
		Object.entries(this.games).forEach(entry => {
			if (entry[1] > lastAmount) {
				mostWatchedGame = entry[0];
				lastAmount = entry[1];
			}
		});
		return mostWatchedGame;
	}
	private static getMostWatchedChannel() {
		let mostWatchedChannel = "";
		let lastAmount = -1;
		this.streamers.forEach(entry => {
			if (entry.viewers > lastAmount) {
				mostWatchedChannel = entry.display;
				lastAmount = entry.viewers;
			}
		});
		return mostWatchedChannel;
	}
}
