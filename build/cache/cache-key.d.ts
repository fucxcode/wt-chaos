declare class CacheKey {
    static readonly wildcard = "*";
    private _team;
    readonly team: string;
    private _collectionName;
    readonly collectionName: string;
    private _id;
    readonly id: string;
    constructor(team: string, collectionName: string, id: string);
    toString(prefix?: string): string;
    toPattern(prefix?: string): string;
    static parse(value: string): CacheKey;
    static tryParse(value: string): [boolean, CacheKey | null];
}
export { CacheKey };
