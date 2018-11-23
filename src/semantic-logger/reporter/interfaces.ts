import { OutPut } from "../controller";

interface Reporter {
    report<T>(entity: OutPut<T>): Promise<OutPut<T>>;
}

interface Querier {
    query<T>(opts: QueryOptions): Promise<OutPut<T>>;
}

interface QueryOptions {
    limit?: number;

    skip?: number;

    include?: Array<number>;

    range?: Array<number>;

    fields: any;
}

export { Reporter, Querier, OutPut, QueryOptions };
