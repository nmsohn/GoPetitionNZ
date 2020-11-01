import { IPetitionItem } from "../src/types/petitions.types";
import getPetitionItem from "../src/lib/getPetitionItem";

describe('Get a petition item', () => {
    test('A petition item returns an object', async() => {
        const petition: IPetitionItem | undefined = await getPetitionItem(99776);

        if(petition){
            expect(typeof petition).toBe('object');
            expect(petition.documentId).toEqual('PET_99776');
            expect(petition.requester).toEqual('Kim Hyunwoo');
            expect(petition.status).toEqual('Closed');
            expect(petition.signatures).toEqual(3);
            expect(petition.title).toEqual('Express concern to South Korea at actions of diplomat')
            expect(typeof petition.closingDate).toBe('string');
        }
    });
});