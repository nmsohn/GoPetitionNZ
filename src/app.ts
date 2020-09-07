import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import * as logger from "morgan";

class App {
	public app: Application;

	constructor() {
		this.app = express();
		dotenv.config();
	}

	public config(): void {}
}
