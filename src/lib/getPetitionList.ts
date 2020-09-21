import axios from "axios";
import cheerio from "cheerio";
import Logger from "../utils/logger";

import { IPetitionItem, IPetitionList } from "../types/petitions.types";
import userAgent from "../config/userAgent.json";
import getPetitionItem from "./getPetitionItem";

import { isNil, omitBy } from "lodash";

const logger = new Logger().init();

const getPetitionList = async (status: string = "open"): Promise<IPetitionList | undefined> => {
	try {
		switch (status) {
			case "open":
				return getOpenPetitions();
			case "closed":
				return getClosedPetitions();
			case "presented":
				return getPresentedPetitions();
			case "all":
				return getAllPetitions();
		}
		return undefined;
	} catch (err) {
		logger.log({
			level: "error",
			message: err
		});
	}
};

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

	return createPetitionList(URL);
};

export const getClosedPetitions = async (): Promise<IPetitionList | undefined> => {
	const URL = `https://www.parliament.nz/en/pb/petitions/closed?Criteria.Sort=IOBClosingDate&Criteria.Direction=Ascending&Criteria.page=Petitions&Criteria.ViewAll=1`;

	return createPetitionList(URL);
};

export const getPresentedPetitions = async (): Promise<IPetitionList | undefined> => {
	const URL = `https://www.parliament.nz/en/pb/petitions/presentedreported?Criteria.Sort=IOBClosingDate&Criteria.Direction=Ascending&Criteria.page=Petitions&Criteria.ViewAll=1`;

	return createPetitionList(URL);
};

export const createPetitionList = async (URL: string): Promise<IPetitionList | undefined> => {
	let temp = [];
	let list: IPetitionItem[] = [];
	let item: IPetitionItem | undefined;

	try {
		let response = await axios.get(URL, {
			headers: userAgent
		});

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

			if (id) {
				await getPetitionItem(Number(id))
					.then((resolve) => {
						item = resolve;
					})
					.catch((reject) => {
						console.log(reject);
					});
			} else {
				item = undefined;
			}

			temp.push(item);
			let cleaned = omitNil(temp);
			Object.values(cleaned).map((i) => {
				list.push(i);
			});
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

const omitNil = (object: any[]) => {
	return omitBy(object, isNil);
};

export default getPetitionList;
