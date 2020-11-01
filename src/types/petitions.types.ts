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
	currentPage?: number;
	countPerPage?: number;
	status?: string;
	totalPage?: number;
	totalNumber: number;
	petitions: IPetitionItem[];
}

export interface IPetitionListParam {
	status?: string;
	page?: number;
}