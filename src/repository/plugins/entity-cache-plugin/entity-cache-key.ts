import { WTError, WTCode } from "../../../errors";

class EntityCacheKey {

    public static readonly wildcard = `*`;

    private _team: string;
    public get team(): string {
        return this._team;
    }

    private _collectionName: string;
    public get collectionName(): string {
        return this._collectionName;
    }

    private _id: string;
    public get id(): string {
        return this._id;
    }

    constructor(team: string, collectionName: string, id: string) {
        this._team = team;
        this._collectionName = collectionName;
        this._id = id;
    }

    toString(prefix: string = ``): string {
        return `${prefix}{${this._team}}${this._collectionName}:${this._id}`;
    }

    toPattern(prefix: string = ``): string {
        let pattern = `{${this._team}}`;
        if (this._collectionName === EntityCacheKey.wildcard) {
            pattern = `${pattern}*`;
        }
        else if (this._id === EntityCacheKey.wildcard) {
            pattern = `${pattern}${this._collectionName}:*`;
        }
        else {
            pattern = this.toString();
        }
        return `${prefix}${pattern}`;
    }

    static parse(value: string): EntityCacheKey {
        const posColon = value.indexOf(`:`);
        const posLeftBrace = value.indexOf(`{`);
        const posRightBrace = value.indexOf(`}`);

        if (posColon >= 0 &&
            posLeftBrace >= 0 && posRightBrace >= 0 &&
            posRightBrace > posLeftBrace &&
            posLeftBrace > posColon) {
            return new EntityCacheKey(
                value.substring(posLeftBrace + 1, posRightBrace),
                value.substring(posRightBrace + 1, posColon),
                value.substring(posColon + 1)
            );
        }
        else {
            throw new WTError(WTCode.invalidInput, "invalid format of cache key", "PREFIX|{TEAM_ID}COLLECTION_NAME:ID", value);
        }
    }

    static tryParse(value: string): [boolean, EntityCacheKey | undefined] {
        try {
            return [true, EntityCacheKey.parse(value)];
        }
        catch {
            return [false, undefined];
        }
    }

}

export { EntityCacheKey };