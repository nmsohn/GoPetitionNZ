import { Router, Request, Response } from "express";
import getPetitionItem from "../lib/getPetitionItem";
import getPetitionList from "../lib/getPetitionList";
import Cache from "../utils/cache";
import {IPetitionList} from "../types/petitions.types";

class PetitionsRoutes {
	public router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	private init() {
		this.router.get('/', function(req, res, next) {
			console.log(' hello heroku ');
			res.send({
				express: 'Your express backend is connected'
			})
		  });
		this.router.get("/petition/:id", this.getOne);
		this.router.get("/petitions/:status", this.getList);
	}

	private async getList(req: Request, res: Response): Promise<void> {
		let status = req.params.status ? req.params.status : "open";
		let page = req.query.page ? Number(req.query.page) : 1;
		let params = {status, page}

		const cacheKey = `petitions::${status}`;
		const ttl = 1 * 60 * 60; // 1 hr
		const nodeCache = new Cache(ttl);

		const cachedData: IPetitionList = await nodeCache.get(cacheKey, getPetitionList, params);

		res.json(cachedData);
	}

	private async getOne(req: Request, res: Response): Promise<void> {
		let query = req.params.id;
		const petition = await getPetitionItem(Number(query));
		res.json(petition);
	}
}

export default PetitionsRoutes;
