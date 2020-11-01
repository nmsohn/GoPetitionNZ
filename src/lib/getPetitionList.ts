import axios from "axios";
import cheerio from "cheerio";
import Logger from "../utils/logger";
import userAgent from "../config/userAgent.json";
import { IPetitionItem, IPetitionList } from "../types/petitions.types";

const logger = new Logger().init();

const getPetitionList = async (status: string = "open"): Promise<IPetitionList | undefined> => {
	try {
		switch (status) {
			case "open":
				return await getOpenPetitions();
			case "closed":
				return await getClosedPetitions();
			case "presented":
				return await getPresentedPetitions();
			case "all":
				return await getAllPetitions();
		}
		return undefined;
	} catch (err) {
		logger.log({
			level: "error",
			message: err
		});
	}
};

//NOTE: Combine all petition lists
export const getAllPetitions = async (): Promise<IPetitionList | undefined> => {
	let totalList: IPetitionItem[] = [];
	let totalNumber: number = 0;
	let openPetitions: IPetitionList | undefined = await getOpenPetitions();
	let closedPetitions: IPetitionList | undefined = await getClosedPetitions();
	let presentedPetitions: IPetitionList | undefined = await getPresentedPetitions();

	if(openPetitions?.petitions){
		totalList.concat(openPetitions?.petitions);
		totalNumber += openPetitions?.totalNumber;
	}

	if(closedPetitions?.petitions){
		totalList.concat(closedPetitions?.petitions);
		totalNumber += closedPetitions?.totalNumber;
	}

	if(presentedPetitions?.petitions){
		totalList.concat(presentedPetitions?.petitions);
		totalNumber += presentedPetitions?.totalNumber;
	}

	return {
		totalNumber: totalNumber,
		petitions: totalList
	};
};

export const getOpenPetitions = async (): Promise<IPetitionList | undefined> => {
	const URL = `https://www.parliament.nz/en/pb/petitions/open?Criteria.Sort=IOBClosingDate&Criteria.Direction=Ascending&Criteria.page=Petitions&Criteria.ViewAll=1`;
	const status = "open";

	return await createPetitionList(URL, status);
};

export const getClosedPetitions = async (): Promise<IPetitionList | undefined> => {
	const URL = `https://www.parliament.nz/en/pb/petitions/closed?Criteria.Sort=IOBClosingDate&Criteria.Direction=Ascending&Criteria.page=Petitions&Criteria.ViewAll=1`;
	const status = "closed";

	return await createPetitionList(URL, status);
};

export const getPresentedPetitions = async (): Promise<IPetitionList | undefined> => {
	const URL = `https://www.parliament.nz/en/pb/petitions/presentedreported?Criteria.Sort=IOBClosingDate&Criteria.Direction=Ascending&Criteria.page=Petitions&Criteria.ViewAll=1`;
	const status = "presented";

	return await createPetitionList(URL, status);
};

export const createPetitionList = async (URL: string, status: string): Promise<IPetitionList | undefined> => {
	let temp = [];
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

		for (let t = 1; t <= total; t++) {
			let id = $(`table.table--list > tbody > tr:nth-child(${t}) > td:nth-child(1) > div > a`)
				.attr("href")
				?.toString()
				.replace(/.*\/PET_(.*)\/.*/, "$1");
			let title = $(`table.table--list > tbody > tr:nth-child(${t}) > td:nth-child(1)`).text().replace(/.*\:(.*)/, "$1").trim();
			let signatures = Number($(`table.table--list > tbody > tr:nth-child(${t}) > td:nth-child(3)`).text().trim());
			let documentId = id ? "PET_".concat(id.toString()) : "unknown";
			let closingDate =  $(`table.table--list > tbody > tr:nth-child(${t}) > td:nth-child(2)`).text().trim();
			let requester = $(`table.table--list > tbody > tr:nth-child(${t}) > td:nth-child(1)`).text().replace(/.*f\s(.*)\:.*/, "$1");

			let item = {
				id: Number(id),
				status: status,
				title: title,
				signatures: signatures,
				documentId: documentId,
				closingDate: closingDate,
				requester: requester
			}

			list.push(item);
		}
		return {
			totalNumber: total,
			petitions: list
		};
	} catch (err) {
		logger.log({
			level: "error",
			message: err
		});
	}
};

export default getPetitionList;
