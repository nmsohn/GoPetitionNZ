import express, { Application, Request, Response } from "express";
import * as mongoose from "mongoose";
import * as logger from "morgan";

class App {
	public app: Application;

	constructor() {
		this.app = express();
	}

	public config(): void {}
}
