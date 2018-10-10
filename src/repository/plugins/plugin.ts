import { SavePluginContext } from "./contexts/plugin-context-save";
import { Entity } from "../entities";
import { CountPluginContext } from "./contexts/plugin-context-count";
import { FindOneByIdPluginContext } from "./contexts/plugin-context-find-one-by-id";
import { FindByIdsPluginContext } from "./contexts/plugin-context-find-by-ids";
import { FindOnePluginContext } from "./contexts/plugin-context-find-one";
import { FindByPageIndexPluginContext } from "./contexts/plugin-context-find-by-page-index";
import { FindByPageNextPluginContext } from "./contexts/plugin-context-find-by-page-next";
import { UpdatePluginContext } from "./contexts/plugin-context-update";
import { UpdateByIdsPluginContext } from "./contexts/plugin-context-update-by-ids";
import { UpdateByEntityPluginContext } from "./contexts/plugin-context-update-by-entity";
import { ErasePluginContext } from "./contexts/plugin-context-erase";
import { FindOneAndUpdatePluginContext } from "./contexts/plugin-context-find-one-update";
import { FindOneAndUpdateByEntityPluginContext } from "./contexts/plugin-context-find-one-update-by-entity";
import { AggregatePluginContext } from "./contexts/plugin-context-aggregate";
import { MapReducePluginContext } from "./contexts/plugin-context-map-reduce";
import { UpdateByIdPluginContext } from "./contexts/plugin-context-update-by-id";
import { Session } from "../drivers";

abstract class Plugin {

    private _name: string;
    public get name(): string {
        return this._name;
    }

    constructor(name: string) {
        this._name = name;
    }

    public async beforeSave<T extends Entity, TSession extends Session>(context: SavePluginContext<T, TSession>): Promise<void> {

    }

    public async afterSave<T extends Entity, TSession extends Session>(context: SavePluginContext<T, TSession>): Promise<void> {

    }

    public async beforeCount<TSession extends Session>(context: CountPluginContext<TSession>): Promise<void> {

    }

    public async afterCount<TSession extends Session>(context: CountPluginContext<TSession>): Promise<void> {

    }

    public async beforeFindOne<T extends Entity, TSession extends Session>(context: FindOnePluginContext<T, TSession>): Promise<void> {

    }

    public async afterFindOne<T extends Entity, TSession extends Session>(context: FindOnePluginContext<T, TSession>): Promise<void> {

    }

    public async beforeFindOneById<T extends Entity, TSession extends Session>(context: FindOneByIdPluginContext<T, TSession>): Promise<void> {

    }

    public async afterFindOneById<T extends Entity, TSession extends Session>(context: FindOneByIdPluginContext<T, TSession>): Promise<void> {

    }

    public async beforeFindByIds<T extends Entity, TSession extends Session>(context: FindByIdsPluginContext<T, TSession>): Promise<void> {

    }

    public async afterFindByIds<T extends Entity, TSession extends Session>(context: FindByIdsPluginContext<T, TSession>): Promise<void> {

    }

    public async beforeFindByPageIndex<T extends Entity, TSession extends Session>(context: FindByPageIndexPluginContext<T, TSession>): Promise<void> {

    }

    public async afterFindByPageIndex<T extends Entity, TSession extends Session>(context: FindByPageIndexPluginContext<T, TSession>): Promise<void> {

    }
    
    public async beforeFindByPageNext<T extends Entity, TSession extends Session>(context: FindByPageNextPluginContext<T, TSession>): Promise<void> {

    }

    public async afterFindByPageNext<T extends Entity, TSession extends Session>(context: FindByPageNextPluginContext<T, TSession>): Promise<void> {

    }

    public async beforeUpdate<TSession extends Session>(context: UpdatePluginContext<TSession>): Promise<void> {

    }

    public async afterUpdate<TSession extends Session>(context: UpdatePluginContext<TSession>): Promise<void> {

    }

    public async beforeUpdateById<TSession extends Session>(context: UpdateByIdPluginContext<TSession>): Promise<void> {

    }

    public async afterUpdateById<TSession extends Session>(context: UpdateByIdPluginContext<TSession>): Promise<void> {

    }

    public async beforeUpdateByIds<TSession extends Session>(context: UpdateByIdsPluginContext<TSession>): Promise<void> {

    }

    public async afterUpdateByIds<TSession extends Session>(context: UpdateByIdsPluginContext<TSession>): Promise<void> {

    }

    public async beforeUpdateByEntity<T extends Entity, TSession extends Session>(context: UpdateByEntityPluginContext<T, TSession>): Promise<void> {

    }

    public async afterUpdateByEntity<T extends Entity, TSession extends Session>(context: UpdateByEntityPluginContext<T, TSession>): Promise<void> {

    }

    public async beforeErase<TSession extends Session>(context: ErasePluginContext<TSession>): Promise<void> {

    }

    public async afterErase<TSession extends Session>(context: ErasePluginContext<TSession>): Promise<void> {

    }

    public async beforeFindOneAndUpdate<T extends Entity, TSession extends Session>(context: FindOneAndUpdatePluginContext<T, TSession>): Promise<void> {

    }

    public async afterFindOneAndUpdate<T extends Entity, TSession extends Session>(context: FindOneAndUpdatePluginContext<T, TSession>): Promise<void> {

    }

    public async beforeFindOneAndUpdateByEntity<T extends Entity, TSession extends Session>(context: FindOneAndUpdateByEntityPluginContext<T, TSession>): Promise<void> {

    }

    public async afterFindOneAndUpdateByEntity<T extends Entity, TSession extends Session>(context: FindOneAndUpdateByEntityPluginContext<T, TSession>): Promise<void> {

    }

    public async beforeAggregate<T, TSession extends Session>(context: AggregatePluginContext<T, TSession>): Promise<void> {

    }

    public async afterAggregate<T, TSession extends Session>(context: AggregatePluginContext<T, TSession>): Promise<void> {

    }

    public async beforeMapReduce<T, TSession extends Session>(context: MapReducePluginContext<T, TSession>): Promise<void> {

    }

    public async afterMapReduce<T, TSession extends Session>(context: MapReducePluginContext<T, TSession>): Promise<void> {

    }

}

export { Plugin };