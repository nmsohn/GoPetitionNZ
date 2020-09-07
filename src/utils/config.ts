import * as dotenv from "dotenv";

interface IConfig {
	getMongoUrl(): string;
}

class Config implements IConfig {
	constructor() {
		dotenv.config();
	}

	public getMongoUrl(): string {
		const url = process.env.NODE_ENV == "production" ? process.env.PROD_DB_URL : process.env.DEV_DB_URL;
		return url ? url : "";
	}
}

export default Config;
