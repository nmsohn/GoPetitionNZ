import express, { Application, Router } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import { LogStream } from "./utils/logger";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import PetitionsRoutes from "./routes/petitionsRoutes";

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
		this.app.use(cors());
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
		this.app.listen(this.app.get("port"), () => {
			console.log("Server is listening on port", this.app.get("port"));
		});
	}
}

export default App;
