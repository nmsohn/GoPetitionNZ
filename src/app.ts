import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import * as logger from "morgan";

class App {
	public app: Application;
	public DB_URL: string | undefined =
		process.env.NODE_ENV == "production" ? process.env.PROD_DB_URL : process.env.DEV_DB_URL;

	constructor() {
		this.app = express();
		dotenv.config();
	}

	public config(): void {}

	private connectDB(): void {
		mongoose.connect(this.DB_URL || "");
	}
}
