export declare class FindByPageIndexResult<T> {
    private _entities;
    readonly entities: Partial<T>[];
    private _pageIndex;
    readonly pageIndex: number;
    private _pageSize;
    readonly pageSize: number;
    private _pageCount;
    readonly pageCount: number;
    private _count;
    readonly count: number;
    constructor(entities: Partial<T>[], pageIndex: number, pageSize: number, count: number);
}
