type Timestamp = number;
type Order = "asc" | "desc";

export interface QueryOptions {
    limit?: number;

    skip?: number;

    order?: Order;

    include?: Array<any>;

    range?: Array<number>;

    start?: Timestamp;

    util?: Timestamp;

    fileds: any;
}

export interface IQuery {
    /**
     * @param opts
     */
    query(opts: QueryOptions): Promise<any>;
}
