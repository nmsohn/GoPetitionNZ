import { Router, Request, Response } from "express";
import getPetitionItem from "../lib/getPetitionItem";

class PetitionsRoutes {
	public router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	private init() {
		this.router.get("/:id", this.getOne);
	}

	private async getOne(req: Request, res: Response): Promise<void> {
		let query = Number(req.params.id);
		const petition = await getPetitionItem(Number(query));
		res.json(petition);
	}
}

export default PetitionsRoutes;
