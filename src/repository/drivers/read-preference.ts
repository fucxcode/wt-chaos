export enum ReadPreference {
    primary = "primary",
    primaryPreferred = "primaryPreferred",
    secondary = "secondary",
    secondaryPreferred = "secondaryPreferred",
    nearest = "nearest"
}

export class ReadWriteStrategy {

    private _findStrategy: ReadPreference;
    public get findStrategy(): ReadPreference {
        return this._findStrategy;
    }

    private _aggregateStrategy: ReadPreference;
    public get aggregateStrategy(): ReadPreference {
        return this._aggregateStrategy;
    }

    private _mapReduceStrategy: ReadPreference;
    public get mapReduceStrategy(): ReadPreference {
        return this._mapReduceStrategy;
    }

    public static readonly PRIMARY: ReadWriteStrategy = new ReadWriteStrategy(ReadPreference.primary, ReadPreference.primary, ReadPreference.primary);

    public static readonly READ_SECONDARY: ReadWriteStrategy = new ReadWriteStrategy(ReadPreference.secondaryPreferred, ReadPreference.secondaryPreferred, ReadPreference.secondaryPreferred);

    public static readonly AGGREGATE_SECONDARY: ReadWriteStrategy = new ReadWriteStrategy(ReadPreference.primary, ReadPreference.secondaryPreferred, ReadPreference.secondaryPreferred);

    constructor(findStrategy: ReadPreference, aggregateStrategy: ReadPreference, mapReduceStrategy: ReadPreference) {
        this._findStrategy = findStrategy;
        this._aggregateStrategy = aggregateStrategy;
        this._mapReduceStrategy = mapReduceStrategy;
    }

}