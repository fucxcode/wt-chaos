import { Plugin } from "./plugin";
import { ReadPreference, Session } from "../drivers";
import { Entity } from "../entities";
import * as _ from "../../utilities";
import { CountPluginContext } from "./contexts/plugin-context-count";
import { FindOnePluginContext } from "./contexts/plugin-context-find-one";
import { FindOneByIdPluginContext } from "./contexts/plugin-context-find-one-by-id";
import { FindByIdsPluginContext } from "./contexts/plugin-context-find-by-ids";
import { FindByPageIndexPluginContext } from "./contexts/plugin-context-find-by-page-index";
import { FindByPageNextPluginContext } from "./contexts/plugin-context-find-by-page-next";
import { AggregatePluginContext } from "./contexts/plugin-context-aggregate";
import { MapReducePluginContext } from "./contexts/plugin-context-map-reduce";

class ReadWriteStrategyPlugin extends Plugin {

    private _findStrategy: ReadPreference;

    private _aggregateStrategy: ReadPreference;

    private _mapReduceStrategy: ReadPreference;

    public static readonly PRIMARY: ReadWriteStrategyPlugin = new ReadWriteStrategyPlugin(ReadPreference.primary, ReadPreference.primary, ReadPreference.primary);

    public static readonly READ_SECONDARY: ReadWriteStrategyPlugin = new ReadWriteStrategyPlugin(ReadPreference.secondaryPreferred, ReadPreference.secondary, ReadPreference.secondary);

    public static readonly AGGREGATE_SECONDARY: ReadWriteStrategyPlugin = new ReadWriteStrategyPlugin(ReadPreference.primary, ReadPreference.secondary, ReadPreference.secondary);

    constructor(findStrategy: ReadPreference, aggregateStrategy: ReadPreference, mapReduceStrategy: ReadPreference) {
        super("read-write-strategy");

        this._findStrategy = findStrategy;
        this._aggregateStrategy = aggregateStrategy;
        this._mapReduceStrategy = mapReduceStrategy;
    }

    public async beforeCount<TSession extends Session>(context: CountPluginContext<TSession>): Promise<void> {
        context.options = _.assign({}, context.options, {
            readPreference: this._findStrategy
        });
    }

    public async beforeFindOne<T extends Entity, TSession extends Session>(context: FindOnePluginContext<T, TSession>): Promise<void> {
        context.options = _.assign({}, context.options, {
            readPreference: this._findStrategy
        });
    }

    public async beforeFindOneById<T extends Entity, TSession extends Session>(context: FindOneByIdPluginContext<T, TSession>): Promise<void> {
        context.options = _.assign({}, context.options, {
            readPreference: this._findStrategy
        });
    }

    public async beforeFindByIds<T extends Entity, TSession extends Session>(context: FindByIdsPluginContext<T, TSession>): Promise<void> {
        context.options = _.assign({}, context.options, {
            readPreference: this._findStrategy
        });
    }

    public async beforeFindByPageIndex<T extends Entity, TSession extends Session>(context: FindByPageIndexPluginContext<T, TSession>): Promise<void> {
        context.options = _.assign({}, context.options, {
            readPreference: this._findStrategy
        });
    }

    public async beforeFindByPageNext<T extends Entity, TSession extends Session>(context: FindByPageNextPluginContext<T, TSession>): Promise<void> {
        context.options = _.assign({}, context.options, {
            readPreference: this._findStrategy
        });
    }

    public async beforeAggregate<T, TSession extends Session>(context: AggregatePluginContext<T, TSession>): Promise<void> {
        context.options = _.assign({}, context.options, {
            readPreference: this._aggregateStrategy
        });
    }

    public async beforeMapReduce<T, TSession extends Session>(context: MapReducePluginContext<T, TSession>): Promise<void> {
        context.options = _.assign({}, context.options, {
            readPreference: this._mapReduceStrategy
        });
    }

}

export { ReadWriteStrategyPlugin };