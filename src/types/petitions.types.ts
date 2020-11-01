export interface IPetitionItem {
	id: number;
	status: string;
	title: string;
	signatures: number;
	documentId: string;
	closingDate: string;
	requester: string;
}

export interface IPetitionList {
	totalNumber: number;
	petitions: IPetitionItem[];
}
