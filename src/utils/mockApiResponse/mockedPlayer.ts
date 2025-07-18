import type {Pagination} from "../../types/Pagination.type";
import type {Player} from "../../types/Player.type.ts";

export const mockPlayerGetResponse: { data: Pagination<Player> } = {
    data: {
        content: [{
            id: '1',
            firstname: 'John',
            lastname: 'Doe'
        }, {
            id: '2',
            firstname: 'Jane',
            lastname: 'Doe'
        }, {
            id: '3',
            firstname: 'Bob',
            lastname: 'Smith'
        }, {
            id: '4',
            firstname: 'Alice',
            lastname: 'Smith'
        }],
        currentPage: 0,
        totalPages: 0,
        totalElements: 4,
        pageSize: 100
    }
}