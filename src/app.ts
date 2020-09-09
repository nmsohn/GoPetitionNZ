import express, { Application, Request, Response } from "express";
import Connector from "./utils/connector";
import * as logger from "morgan";

class App {
	public app: Application;

	constructor() {
		this.app = express();
	}

	public config(): void {}
}
