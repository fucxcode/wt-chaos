import * as _ from "../utilities";

export class FindByPageIndexResult<T> {
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
    private _pageCount: number;
    public get pageCount(): number {
        return this._pageCount;
    }
    private _count: number;
    public get count(): number {
        return this._count;
    }
    constructor(entities: Partial<T>[], pageIndex: number, pageSize: number, count: number) {
        this._entities = entities;
        this._pageIndex = pageIndex;
        this._pageSize = pageSize;
        this._count = count;
        this._pageCount = _.ceil(this._count / this._pageSize);
    }
}