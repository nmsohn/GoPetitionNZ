import { IPetitionList } from "../src/types/petitions.types";
import getPetitionList, { getAllPetitions, getOpenPetitions, getClosedPetitions, getPresentedPetitions } from "../src/lib/getPetitionList";

describe('Get a petition list', () => {
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