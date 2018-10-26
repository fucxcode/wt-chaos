import { Plugin } from "./plugin";
import { ReadPreference, Session, ReadWriteStrategy } from "../drivers";
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

    private _strategy: ReadWriteStrategy;

    public static readonly PRIMARY: ReadWriteStrategyPlugin = new ReadWriteStrategyPlugin(ReadWriteStrategy.PRIMARY);

    public static readonly READ_SECONDARY: ReadWriteStrategyPlugin = new ReadWriteStrategyPlugin(ReadWriteStrategy.READ_SECONDARY);

    public static readonly AGGREGATE_SECONDARY: ReadWriteStrategyPlugin = new ReadWriteStrategyPlugin(ReadWriteStrategy.AGGREGATE_SECONDARY);

    constructor(strategy: ReadWriteStrategy) {
        super("read-write-strategy");

        this._strategy = strategy;
    }

    public async beforeCount<TSession extends Session>(context: CountPluginContext<TSession>): Promise<void> {
        context.options = _.assign({}, {
            readPreference: this._strategy.findStrategy
        }, context.options);
    }

    public async beforeFindOne<T extends Entity, TSession extends Session>(context: FindOnePluginContext<T, TSession>): Promise<void> {
        context.options = _.assign({}, {
            readPreference: this._strategy.findStrategy
        }, context.options);
    }

    public async beforeFindOneById<T extends Entity, TSession extends Session>(context: FindOneByIdPluginContext<T, TSession>): Promise<void> {
        context.options = _.assign({}, {
            readPreference: this._strategy.findStrategy
        }, context.options);
    }

    public async beforeFindByIds<T extends Entity, TSession extends Session>(context: FindByIdsPluginContext<T, TSession>): Promise<void> {
        context.options = _.assign({}, {
            readPreference: this._strategy.findStrategy
        }, context.options);
    }

    public async beforeFindByPageIndex<T extends Entity, TSession extends Session>(context: FindByPageIndexPluginContext<T, TSession>): Promise<void> {
        context.options = _.assign({}, {
            readPreference: this._strategy.findStrategy
        }, context.options);
    }

    public async beforeFindByPageNext<T extends Entity, TSession extends Session>(context: FindByPageNextPluginContext<T, TSession>): Promise<void> {
        context.options = _.assign({}, {
            readPreference: this._strategy.findStrategy
        }, context.options);
    }

    public async beforeAggregate<T, TSession extends Session>(context: AggregatePluginContext<T, TSession>): Promise<void> {
        context.options = _.assign({}, {
            readPreference: this._strategy.aggregateStrategy
        }, context.options);
    }

    public async beforeMapReduce<T, TSession extends Session>(context: MapReducePluginContext<T, TSession>): Promise<void> {
        context.options = _.assign({}, {
            readPreference: this._strategy.mapReduceStrategy
        }, context.options);
    }

}

export { ReadWriteStrategyPlugin };