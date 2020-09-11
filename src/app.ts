import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import Connector from "./utils/connector";
import { LogStream } from "./utils/logger";
import morgan from "morgan";
import cors from "cors";

class App {
	public app: Application;

	constructor() {
		this.app = express();
		this.middleware();
	}

	private middleware(): void {
		this.app.use(cors());
		this.app.use(morgan("combined", { stream: new LogStream() }));
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(helmet());
	}
}
