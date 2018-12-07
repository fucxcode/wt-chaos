import { Is } from "../../constants";

interface CreateIndexesResult {

    ok: Is;

    drop: boolean;

    collections: {
        name: string,
        nIndexesBefore: number;
        nIndexesAfter: number
    }[];

}

export { CreateIndexesResult };