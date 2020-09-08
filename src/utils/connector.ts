import * as mongoose from "mongoose";
import Config from "./config";

interface IConnector {
	open(): void;
	close(): void;
}

export class connector implements IConnector {
	private readonly DB_URL: string = new Config().getMongoUrl();

	constructor() {
		mongoose.connection.on("connected", this.onConnection());
		mongoose.connection.on("error", this.onError());
		mongoose.connection.on("disconnected", this.onDisconnection());
		mongoose.connection.on("reconnected", this.onReconnection());
	}

	public open(): void {
		const options = {};
		mongoose.connect(this.DB_URL, options);
	}

	public close(): void {
		mongoose.disconnect();
	}

	private onConnection(): any {}
	private onReconnection(): any {}
	private onError(): any {}
	private onDisconnection(): any {}
}

export default mongoose;
