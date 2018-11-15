declare class EntityCacheKey {
    static readonly wildcard: string;
    private _team;
    readonly team: string;
    private _collectionName;
    readonly collectionName: string;
    private _id;
    readonly id: string;
    constructor(team: string, collectionName: string, id: string);
    toString(prefix?: string): string;
    toPattern(prefix?: string): string;
    static parse(value: string): EntityCacheKey;
    static tryParse(value: string): [boolean, EntityCacheKey | undefined];
}
export { EntityCacheKey };
