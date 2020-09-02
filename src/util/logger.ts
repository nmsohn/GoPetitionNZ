import { Logger, createLogger, format, transports, transport } from "winston";

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

const logger: Logger = createLogger({
	format: format.combine(
		format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss"
		}),
		format.prettyPrint()
	),
	transports: [new transports.File(options.file), new transports.Console(options.console)]
});
