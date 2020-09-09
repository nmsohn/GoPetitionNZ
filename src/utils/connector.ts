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

	constructor() {
		this.logger = new Logger().init();
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
		mongoose.connect(this.DB_URL, options);
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
		this.logger.log({
			level: "info",
			message: `Disconnected from database`
		});
	}
}

export default mongoose;
