import { OutPut } from "../controller";
interface IReporter {
    report<T>(entity: OutPut<T>): Promise<OutPut<T>>;
}
interface IQueryer {
    query<T>(opts: QueryOptions): Promise<OutPut<T>>;
}
interface QueryOptions {
    limit?: number;
    skip?: number;
    include?: Array<number>;
    range?: Array<number>;
    fields: any;
}
export { IReporter, IQueryer, OutPut, QueryOptions };
