import express, { Application, Router } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import { LogStream } from "./utils/logger";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import PetitionsRoutes from "./routes/petitionsRoutes";
import * as http from "http";
import Config from "./utils/config";

class App {
	public app: Application;
	public petitionRouter: PetitionsRoutes;

	constructor() {
		this.app = express();
		this.middleware();
		this.petitionRouter = new PetitionsRoutes();
		this.routes();
	}

	private middleware(): void {
		this.app.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
			res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
			next();
		  });
		this.app.use(cors({
    		credentials: true
		}));
		this.app.use(morgan("combined", { stream: new LogStream() }));
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(helmet());
		this.app.use(cookieParser());
	}

	private routes(): void {
		this.app.use("/api/v1/petitions", this.petitionRouter.router);
	}

	public start(): void {
		const port = new Config().getPort();
		this.app.set("PORT", process.env.PORT || 3000);
		this.app.listen(this.app.get("PORT"), () => {
			console.log(`Server is listening on port ${port}`);
		});
	}
}

export default App;
