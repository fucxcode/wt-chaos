export class FindByPageNextResult<T> {
    private _entities: Partial<T>[];
    public get entities(): Partial<T>[] {
        return this._entities;
    }
    private _pageIndex: number;
    public get pageIndex(): number {
        return this._pageIndex;
    }
    private _pageSize: number;
    public get pageSize(): number {
        return this._pageSize;
    }
    private _next: boolean;
    public get next(): boolean {
        return this._next;
    }
    constructor(entities: Partial<T>[], pageIndex: number, pageSize: number, next: boolean) {
        this._entities = entities;
        this._pageIndex = pageIndex;
        this._pageSize = pageSize;
        this._next = next;
    }
}