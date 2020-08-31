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
// 		let requester = $("h1")
// 			.text()
// 			.replace(/.*f\s(.*)\:.*/, "$1");
// 		console.log(requester);
// 	})
// 	.catch((e) => {
// 		console.log(e);
// 	});
