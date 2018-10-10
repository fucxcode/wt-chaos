export declare class FindByPageNextResult<T> {
    private _entities;
    readonly entities: Partial<T>[];
    private _pageIndex;
    readonly pageIndex: number;
    private _pageSize;
    readonly pageSize: number;
    private _next;
    readonly next: boolean;
    constructor(entities: Partial<T>[], pageIndex: number, pageSize: number, next: boolean);
}
