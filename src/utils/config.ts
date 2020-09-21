import * as dotenv from "dotenv";

interface IConfig {
	getEnvironmentName(): string;
	getPort(): string;
}

class Config implements IConfig {
	constructor() {
		dotenv.config();
	}

	public getEnvironmentName(): string {
		const env = process.env.NODE_ENV ?? "development";
		return env;
	}

	public getPort(): string {
		const port = process.env.PORT ?? "3000";
		return port;
	}
}

export default Config;
