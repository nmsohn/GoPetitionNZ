import { IPetitionItem, IPetitionList } from "../types/petitions.types";

class Paginate{
    private limit: number;
    constructor(limit: number)
    {
        this.limit = limit;
    }

    public getOffset(page: number): number
    {
		return (page? (page - 1) : 0) * this.limit;

    }

    public getNumberOfPage(total: number)
    {
        return Math.ceil(total/this.limit);
    }

    public getPaginatedItems(list: IPetitionItem[], page: number, total: number, status: string) : IPetitionList
    {
        const offset = this.getOffset(page);
        const count = this.getNumberOfPage(total);
        const paginated = list.slice(offset, offset + this.limit);

        return {
            status: status,
            currentPage: page,
            totalPage: count,
            countPerPage: list.length,
            totalNumber: total,
            petitions: paginated
        };
    }
}

export default Paginate;