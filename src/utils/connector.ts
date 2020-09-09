import * as mongoose from "mongoose";
import Config from "./config";
import Logger from "./logger";
import * as winston from "winston";

interface IConnector {
	open(): void;
	close(): void;
}

export class connector implements IConnector {
	private readonly DB_URL: string = new Config().getMongoUrl();
	private logger: winston.Logger;
	private isConnected: boolean = false;

	constructor() {
		this.logger = new Logger(new Config().getEnvironmentName()).init();
		mongoose.connection.on("connected", this.onConnection());
		mongoose.connection.on("error", this.onError());
		mongoose.connection.on("disconnected", this.onDisconnection());
		mongoose.connection.on("reconnected", this.onReconnection());
	}

	public open(): void {
		const options = {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		};
		if (!this.isConnected) {
			mongoose.connect(this.DB_URL, options);
			this.isConnected = true;
		}
	}

	public close(): void {
		mongoose.disconnect();
	}

	private onConnection(): any {
		this.logger.log({
			level: "info",
			message: `Connected to database at ${this.DB_URL}`
		});
	}
	private onReconnection(): any {
		this.logger.log({
			level: "info",
			message: `Reconnected to database`
		});
	}
	private onError(): any {
		this.logger.log({
			level: "error",
			message: `Could not connect to ${this.DB_URL}`
		});
	}
	private onDisconnection(): any {
		if (!this.isConnected) {
			setTimeout(() => {
				this.open();
			}, 2000);
		}
		this.logger.log({
			level: "info",
			message: `Disconnected from database. Trying to reconnect`
		});
	}
}

export default mongoose;
