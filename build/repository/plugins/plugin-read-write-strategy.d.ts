import { Plugin } from "./plugin";
import { ReadPreference, Session } from "../drivers";
import { Entity } from "../entities";
import { CountPluginContext } from "./contexts/plugin-context-count";
import { FindOnePluginContext } from "./contexts/plugin-context-find-one";
import { FindOneByIdPluginContext } from "./contexts/plugin-context-find-one-by-id";
import { FindByIdsPluginContext } from "./contexts/plugin-context-find-by-ids";
import { FindByPageIndexPluginContext } from "./contexts/plugin-context-find-by-page-index";
import { FindByPageNextPluginContext } from "./contexts/plugin-context-find-by-page-next";
import { AggregatePluginContext } from "./contexts/plugin-context-aggregate";
import { MapReducePluginContext } from "./contexts/plugin-context-map-reduce";
declare class ReadWriteStrategyPlugin extends Plugin {
    private _findStrategy;
    private _aggregateStrategy;
    private _mapReduceStrategy;
    static readonly PRIMARY: ReadWriteStrategyPlugin;
    static readonly READ_SECONDARY: ReadWriteStrategyPlugin;
    static readonly AGGREGATE_SECONDARY: ReadWriteStrategyPlugin;
    constructor(findStrategy: ReadPreference, aggregateStrategy: ReadPreference, mapReduceStrategy: ReadPreference);
    beforeCount<TSession extends Session>(context: CountPluginContext<TSession>): Promise<void>;
    beforeFindOne<T extends Entity, TSession extends Session>(context: FindOnePluginContext<T, TSession>): Promise<void>;
    beforeFindOneById<T extends Entity, TSession extends Session>(context: FindOneByIdPluginContext<T, TSession>): Promise<void>;
    beforeFindByIds<T extends Entity, TSession extends Session>(context: FindByIdsPluginContext<T, TSession>): Promise<void>;
    beforeFindByPageIndex<T extends Entity, TSession extends Session>(context: FindByPageIndexPluginContext<T, TSession>): Promise<void>;
    beforeFindByPageNext<T extends Entity, TSession extends Session>(context: FindByPageNextPluginContext<T, TSession>): Promise<void>;
    beforeAggregate<T, TSession extends Session>(context: AggregatePluginContext<T, TSession>): Promise<void>;
    beforeMapReduce<T, TSession extends Session>(context: MapReducePluginContext<T, TSession>): Promise<void>;
}
export { ReadWriteStrategyPlugin };
