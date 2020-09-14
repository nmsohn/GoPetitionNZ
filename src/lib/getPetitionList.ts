import axios from "axios";
import cheerio from "cheerio";
import Logger from "../utils/logger";

import { IPetitionItem, IPetitionList } from "../types/petitions.types";
import userAgent from "../config/userAgent.json";
import getPetitionItem from "./getPetitionItem";

import { isNil, omitBy } from "lodash";

const logger = new Logger().init();

const getPetitionList = async (status: string = "all"): Promise<IPetitionList | undefined> => {
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

const getAllPetitions = async (): Promise<IPetitionList | undefined> => {
	let totalList: IPetitionItem[] = [];
	let totalNumber: number = 0;
	await getOpenPetitions().then((resolve) => {
		totalNumber += resolve?.totalNumber ?? 0;
		if (resolve?.petitions) {
			totalList.concat(resolve?.petitions);
		}
	});
	await getClosedPetitions().then((resolve) => {
		totalNumber += resolve?.totalNumber ?? 0;
		if (resolve?.petitions) {
			totalList.concat(resolve?.petitions);
		}
	});
	await getPresentedPetitions().then((resolve) => {
		totalNumber += resolve?.totalNumber ?? 0;
		if (resolve?.petitions) {
			totalList.concat(resolve?.petitions);
		}
	});

	return {
		totalNumber: totalNumber,
		petitions: totalList
	};
};

const getOpenPetitions = async (): Promise<IPetitionList | undefined> => {
	let URL = `https://www.parliament.nz/en/pb/petitions/open?Criteria.Sort=IOBClosingDate&Criteria.Direction=Ascending&Criteria.page=Petitions&Criteria.ViewAll=1`;

	return await createPetitionList(URL);
};

const getClosedPetitions = async (): Promise<IPetitionList | undefined> => {
	let URL = `https://www.parliament.nz/en/pb/petitions/closed?Criteria.Sort=IOBClosingDate&Criteria.Direction=Ascending&Criteria.page=Petitions&Criteria.ViewAll=1`;

	return await createPetitionList(URL);
};

const getPresentedPetitions = async (): Promise<IPetitionList | undefined> => {
	let URL = `https://www.parliament.nz/en/pb/petitions/presentedreported?Criteria.Sort=IOBClosingDate&Criteria.Direction=Ascending&Criteria.page=Petitions&Criteria.ViewAll=1`;

	return await createPetitionList(URL);
};

const createPetitionList = async (URL: string) => {
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
			omitNil(temp).map((i: IPetitionItem) => list.push(i));
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
