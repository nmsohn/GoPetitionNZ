import axios from "axios";
import cheerio, { html } from "cheerio";

import { IPetitionItem } from "../models/Petition";
import userAgent from "../config/userAgent.json";

const getPetitionItem = async (id: number = 99268): Promise<{ id: number; requester: string } | undefined> => {
	let URL = `https://www.parliament.nz/en/pb/petitions/document/PET_${id}`;
	try {
		let response = await axios.get(URL, {
			headers: userAgent
		});
		let htmlData = response.data;
		let $ = cheerio.load(htmlData);
		let requester = $("h1")
			.text()
			.replace(/.*f\s(.*)\:.*/, "$1");
		return {
			id: id,
			requester: requester
		};
	} catch (err) {
		console.log(err);
	}
};

export default getPetitionItem;
