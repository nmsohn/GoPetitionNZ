import { Router, Request, Response } from "express";
import getPetitionItem from "../lib/getPetitionItem";
import getPetitionList from "../lib/getPetitionList";
import Cache from "../utils/cache";

class PetitionsRoutes {
	public router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	private init() {
		this.router.get("/:id", this.getOne);
		this.router.get("/:status", this.getList);
	}

	private async getList(req: Request, res: Response): Promise<void> {
		const cacheKey = `petitions::${req.params.status || "all"}`;
		const ttl = 1 * 60 * 60; // 1 hr
		const nodeCache = new Cache(ttl);
		// const petitions = await getPetitionList(req.params.status);
		const cachedData = nodeCache.get(cacheKey, getPetitionList, req.params.status);

		res.json(cachedData);
	}

	private async getOne(req: Request, res: Response): Promise<void> {
		let query = req.params.id;
		const petition = await getPetitionItem(Number(query));
		res.json(petition);
	}
}

export default PetitionsRoutes;
