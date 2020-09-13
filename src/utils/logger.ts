import * as winston from "winston";
import Config from "./config";

interface ILogger {
	init(): winston.Logger;
}

export class Logger implements ILogger {
	private logger: winston.Logger | undefined;
	private env: string;

	constructor() {
		this.env = new Config().getEnvironmentName();
		this.logger = undefined;
	}

	public init(): winston.Logger {
		const options = {
			file: {
				level: "info",
				filename: "info.log",
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
				winston.format.json(),
				winston.format.prettyPrint()
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

export class LogStream {
	write(msg: string) {
		new Logger().init().info(msg);
	}
}

export default Logger;
