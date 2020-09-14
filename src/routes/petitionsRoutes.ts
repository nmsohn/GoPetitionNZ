import { Router, Request, Response } from "express";
import getPetitionItem from "../lib/getPetitionItem";
import getPetitionList from "../lib/getPetitionList";

class PetitionsRoutes {
	public router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	private init() {
		this.router.get("/:id", this.getOne);
		this.router.get("/:status", this.getAll);
	}

	private async getAll(req: Request, res: Response): Promise<void> {
		const petitions = await getPetitionList(req.params.status);
		res.json(petitions);
	}

	private async getOne(req: Request, res: Response): Promise<void> {
		let query = req.params.id;
		const petition = await getPetitionItem(Number(query));
		res.json(petition);
	}
}

export default PetitionsRoutes;
