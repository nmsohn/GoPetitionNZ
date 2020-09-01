import axios from "axios";
import cheerio, { html } from "cheerio";

import { IPetitionItem } from "../models/Petition";
import userAgent from "../config/userAgent.json";

const getPetitionItem = async (id: number): Promise<IPetitionItem | undefined> => {
	const URL = `https://www.parliament.nz/en/pb/petitions/document/PET_${id}`;
	try {
		let response = await axios.get(URL, {
			headers: userAgent
		});
		let htmlData = response.data;
		let $ = cheerio.load(htmlData);

		const requester = $("h1")
			.text()
			.replace(/.*f\s(.*)\:.*/, "$1");

		const title = $("h1")
			.text()
			.replace(/.*\:(.*)/, "$1")
			.trim();

		const status = $("td.bill-status-cell--current > div > span:nth-child(2)").text().trim();

		const signatures = Number($("table.variablelist > tbody > tr:nth-child(1) > td").text().trim());

		const documentId = "PET_".concat(id.toString());

		const startDate = $("span.publish-date")
			.text()
			.replace(/.*\:(.*)/, "$1")
			.trim();

		const closingDate = $("table.variablelist > tbody > tr:nth-child(2) > td").text().trim();

		return {
			id: id,
			requester: requester,
			title: title,
			documentId: documentId,
			status: status,
			startDate: startDate,
			closingDate: closingDate,
			signatures: signatures
		};
	} catch (err) {
		console.log(err);
	}
};

export default getPetitionItem;