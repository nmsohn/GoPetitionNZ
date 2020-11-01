import { IPetitionList } from "../src/types/petitions.types";
import getPetitionList from "../src/lib/getPetitionList";

jest.useFakeTimers();

describe('Get a petition list', () => {
    afterEach(() => {
        jest.clearAllTimers();
      });
      
    test('Return open petitions', async() => {
        const status = 'open';
        const petitions: IPetitionList | undefined = await getPetitionList({status: status, page: 3});

        if(petitions){
            expect(typeof petitions).toBe('object');
            expect(petitions.status).toEqual("open");
            expect(petitions.currentPage).toEqual(3);
            expect(petitions.totalPage).toEqual(3);
            expect(petitions.totalNumber).toEqual(118);
            expect(petitions.countPerPage).toEqual(18);
        }
    }, 30000);

    test('Return closed petitions', async() => {
        const status = 'closed';
        const petitions: IPetitionList | undefined = await getPetitionList({status: status});

        if(petitions){
            expect(typeof petitions).toBe('object');
            expect(petitions.status).toEqual("closed");
            expect(petitions.totalNumber).toEqual(814);
            expect(petitions.countPerPage).toEqual(petitions.petitions.length);
        }
    }, 30000);

    test('Return presented petitions', async() => {
        const status = 'presented';
        const petitions: IPetitionList | undefined = await getPetitionList({status: status});

        if(petitions){
            expect(typeof petitions).toBe('object');
            expect(petitions.status).toEqual("presented");
            expect(petitions.totalNumber).toEqual(421);
            expect(petitions.countPerPage).toEqual(petitions.petitions.length);
        }
    }, 30000);
});