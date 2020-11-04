import axios from "axios";
import cheerio from "cheerio";
import Logger from "../utils/logger";
import userAgent from "../config/userAgent.json";
import { IPetitionItem, IPetitionList, IPetitionListParam } from "../types/petitions.types";
import Paginate from "../utils/paginate";
import { isNil, omitBy } from "lodash";

const limit = 50;
const logger = new Logger().init();
const helper = new Paginate(limit);

const getPetitionList = async ({ status = "open", page = 1 }: IPetitionListParam = {}): Promise<IPetitionList | undefined> => {
	try {
		switch (status) {
			case "open":
				return await getOpenPetitions(page);
			case "closed":
				return await getClosedPetitions(page);
			case "presented":
				return await getPresentedPetitions(page);
			case "reported":
				return await getReportedPetitions(page);	
		}
		return undefined;
	} catch (err) {
		logger.log({
			level: "error",
			message: err
		});
	}
};


export const getOpenPetitions = async (page: number): Promise<IPetitionList | undefined> => {
	const URL = `https://www.parliament.nz/en/pb/petitions/open?Criteria.Sort=IOBClosingDate&Criteria.Direction=Ascending&Criteria.page=Petitions&Criteria.ViewAll=1`;
	const status = "open";

	return await createPetitionList(URL, status, page);
};

export const getClosedPetitions = async (page: number): Promise<IPetitionList | undefined> => {
	const URL = `https://www.parliament.nz/en/pb/petitions/closed?Criteria.Sort=IOBClosingDate&Criteria.Direction=Ascending&Criteria.page=Petitions&Criteria.ViewAll=1`;
	const status = "closed";

	return await createPetitionList(URL, status, page);
};

export const getPresentedPetitions = async (page: number): Promise<IPetitionList | undefined> => {
	const URL = `https://www.parliament.nz/en/pb/petitions/presentedreported?Criteria.Sort=IOBClosingDate&Criteria.Direction=Ascending&Criteria.page=Petitions&Criteria.ViewAll=1`;
	const status = "presented";

	return await createPetitionList(URL, status, page);
};

export const getReportedPetitions = async (page: number): Promise<IPetitionList | undefined> => {
	const URL = `https://www.parliament.nz/en/pb/petitions/presentedreported?Criteria.Sort=IOBClosingDate&Criteria.Direction=Ascending&Criteria.page=Petitions&Criteria.ViewAll=1`;
	const status = "reported";

	return await createPetitionList(URL, status, page);
};

export const createPetitionList = async (URL: string, status: string, page: number): Promise<IPetitionList | undefined> => {
	let list: IPetitionItem[] = [];
	const options = {
		headers: userAgent,
		timeout: 30000
	};

	try {
		let response = await axios.get(URL, options);

		let htmlData = response.data;
		let $ = cheerio.load(htmlData);

		const total = Number(
			$("span.listing-result")
				.text()
				.replace(/.*f\s(.*)/, "$1")
		);

		const offset = helper.getOffset(page) + 1;
		const count = helper.getNumberOfPage(total);
		const end = (offset + limit) <= total ? offset + limit : total + 1;
		list = await crawlList($, offset, end, status);
		return {
			status: status,
			currentPage: page,
			countPerPage: list.length,
			totalPage: count,
			totalNumber: total,
			petitions: list
		}

	} catch (err) {
		logger.log({
			level: "error",
			message: err
		});
	}
};

const crawlList = async ($: any, start: number, end: number, status: string): Promise<IPetitionItem[]> => {
	let list: IPetitionItem[] = [];
	let temp = [];

	for (let t = start; t < end; t++) {
		let s = status == "open" ? status : $(`table.table--list > tbody > tr:nth-child(${t}) > td:nth-child(2)`).text().trim().toLowerCase();
		if(status == s)
		{
			let id = $(`table.table--list > tbody > tr:nth-child(${t}) > td:nth-child(1) > div > a`)
			.attr("href")
			?.toString()
			.replace(/(.*\/PET_|PET|.*DBHOH_PET)(.*)(_|\/.*)/, "$2").trim();
			let requester = $(`table.table--list > tbody > tr:nth-child(${t}) > td:nth-child(1)`).text()
				.replace(/.*f\s(.*)[\:\-].*/, "$1")
				.trim();
			let title = $(`table.table--list > tbody > tr:nth-child(${t}) > td:nth-child(1)`).text().replace(/.*[\:\-]\s(.*)/, "$1").trim();
			let signatures = Number($(`table.table--list > tbody > tr:nth-child(${t}) > td:nth-child(4)`).text().trim());
			let documentId = id ? "PET_".concat(id.toString()) : "unknown";
			let closingDate = status == "open" ? $(`table.table--list > tbody > tr:nth-child(${t}) > td:nth-child(2)`).text().trim() : $(`table.table--list > tbody > tr:nth-child(${t}) > td:nth-child(3)`).text().trim();

			let item = {
				id: Number(id),
				status: status,
				title: title,
				signatures: signatures,
				documentId: documentId,
				closingDate: closingDate,
				requester: requester
			}
			temp.push(item);
		}
	}
	let cleaned = omitNil(temp);
	Object.values(cleaned).map((i) => {
		list.push(i);
	});
	return list;
}

const omitNil = (object: any[]) => {
	return omitBy(object, isNil);
};


export default getPetitionList;
