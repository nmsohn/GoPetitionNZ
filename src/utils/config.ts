import * as dotenv from "dotenv";

interface IConfig {
	getEnvironmentName(): string;
	getPort(): string;
}

class Config implements IConfig {
	constructor() {
		dotenv.config();
	}

	// public getMongoUrl(): string {
	// 	const url = process.env.NODE_ENV == "production" ? process.env.PROD_DB_URL : process.env.DEV_DB_URL;
	// 	return url ? url : "";
	// }

	public getEnvironmentName(): string {
		const env = process.env.NODE_ENV ?? "development";
		return env;
	}

	public getPort(): string {
		const port = process.env.NODE_ENV ?? "8080";
		return port;
	}
}

export default Config;
