import { IPetitionList } from "../src/types/petitions.types";
import getPetitionList, { getAllPetitions, getOpenPetitions, getClosedPetitions, getPresentedPetitions } from "../src/lib/getPetitionList";

jest.useFakeTimers();

describe('Get a petition list', () => {
    afterEach(() => {
        jest.clearAllTimers();
      });
    test('Return open petitions', async() => {
        const status = 'open';
        const petitions: IPetitionList | undefined = await getPetitionList(status);

        if(petitions){
            expect(typeof petitions).toBe('IPetitionList');
            expect(petitions.totalNumber).toEqual(139);
            expect(petitions.petitions.length).toEqual(139);
        }
    });
});