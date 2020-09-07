import * as winston from "winston";
import * as dotenv from "dotenv";

interface ILogger {
	init(): Promise<winston.Logger>;
}

export class Logger implements ILogger {
	private logger: winston.Logger | undefined;
	private env: string;

	constructor(env: string) {
		this.env = env;
		this.logger = undefined;
	}

	public async init(): Promise<winston.Logger> {
		const options = {
			file: {
				level: "info",
				filename: "",
				handleExceptions: true,
				json: true,
				maxFiles: 2,
				maxSize: 1024 * 1024 * 5
			},
			console: {
				level: "debug",
				colorize: true,
				handleExceptions: true,
				json: false
			}
		};

		this.logger = winston.createLogger({
			exitOnError: false,
			format: winston.format.combine(
				winston.format.timestamp({
					format: "YYYY-MM-DD HH:mm:ss"
				}),
				winston.format.errors({ stack: true }),
				winston.format.splat(),
				winston.format.json()
				// winston.format.prettyPrint()
			),
			transports: [new winston.transports.File(options.file)]
		});

		if (this.env !== "production") {
			this.logger.clear();
			this.logger.add(new winston.transports.Console(options.console));
		}

		return this.logger;
	}
}

export default Logger;
