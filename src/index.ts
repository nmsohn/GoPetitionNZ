import getPetitionItem from "./lib/getPetitionItem";

let petition;

(async () => {
	petition = await getPetitionItem(Number(99268));
})();

// import axios from "axios";
// import cheerio, { html } from "cheerio";
// import userAgent from "./config/userAgent.json";

// const id = 99268;
// const URL = `https://www.parliament.nz/en/pb/petitions/document/PET_${id}`;

// axios
// 	.get(URL, {
// 		headers: userAgent
// 	})
// 	.then((res) => {
// 		let $ = cheerio.load(res.data);
// 		const requester = $("h1")
// 			.text()
// 			.replace(/.*f\s(.*)\:.*/, "$1")
// 			.trim();

// 		const title = $("h1")
// 			.text()
// 			.replace(/.*\:(.*)/, "$1")
// 			.trim();

// 		const status = $("td.bill-status-cell--current > div > span:nth-child(2)").text().trim();

// 		const signatures = $("table.variablelist > tbody > tr:nth-child(1) > td").text().trim();

// 		const documentId = "PET_".concat(id.toString());

// 		const startDate = $("span.publish-date")
// 			.text()
// 			.replace(/.*\:(.*)/, "$1")
// 			.trim();

// 		const closingDate = $("table.variablelist > tbody > tr:nth-child(2) > td").text().trim();

// 		console.log(closingDate);
// 	})
// 	.catch((e) => {
// 		console.log(e);
// 	});
