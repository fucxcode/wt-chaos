export declare enum ReadPreference {
    primary = "primary",
    primaryPreferred = "primaryPreferred",
    secondary = "secondary",
    secondaryPreferred = "secondaryPreferred",
    nearest = "nearest"
}
export declare class ReadWriteStrategy {
    private _findStrategy;
    readonly findStrategy: ReadPreference;
    private _aggregateStrategy;
    readonly aggregateStrategy: ReadPreference;
    private _mapReduceStrategy;
    readonly mapReduceStrategy: ReadPreference;
    static readonly PRIMARY: ReadWriteStrategy;
    static readonly READ_SECONDARY: ReadWriteStrategy;
    static readonly AGGREGATE_SECONDARY: ReadWriteStrategy;
    constructor(findStrategy: ReadPreference, aggregateStrategy: ReadPreference, mapReduceStrategy: ReadPreference);
}
