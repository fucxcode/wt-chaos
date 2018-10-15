import { repository } from "../src";
import * as mongodb from "mongodb";
import { MongoDBSession, MongoDBDriver, Repository, Session, Driver, OperationDescription, FindOptions, FindByPageIndexResult, BusinessRepository, MongoDBId } from "../src/repository";
import { DEFAULT_PAGE_SIZE, is } from "../src/constants";
import * as util from "util";
import { inject, injectable, registerContainer, BypassActivationHandler, setDefaultContainer, lifecycles } from "../src/container";

const key = Symbol("default");
const container = registerContainer(key, new BypassActivationHandler());
setDefaultContainer(key);

interface ProjectEntity extends repository.Entity, repository.BusinessEntity {

    name?: string;

}

interface TaskEntity extends repository.Entity, repository.BusinessEntity {

    project_id?: repository.Id;

    title?: string;

}

const keyDriver = Symbol("driver");

@injectable()
class ProjectRepository extends BusinessRepository<MongoDBSession, MongoDBId, MongoDBDriver, ProjectEntity> {

    constructor(@inject(undefined, undefined, keyDriver) driver: MongoDBDriver) {
        super("projects", driver, [
            repository.ReadWriteStrategyPlugin.PRIMARY
        ]);
    }

}

@injectable()
class TaskRepository extends BusinessRepository<MongoDBSession, MongoDBId, MongoDBDriver, TaskEntity> {

    constructor(@inject(undefined, undefined, keyDriver) driver: MongoDBDriver) {
        super("tasks", driver, [
            repository.ReadWriteStrategyPlugin.PRIMARY
        ]);
    }

}

// interface Pingable {
//     ping(): void;
// }

// const TaskRepo = repository.createDeleteableRepository(TaskRepository);

// TaskRepository.prototype.ping = () => {
//     console.log("PONG!");
// };

(async () => {

    const client = await mongodb.connect("mongodb://localhost:27017", {
        useNewUrlParser: true
    });


    const driver = new repository.MongoDBDriver(client, "test");
    container.registerInstance(keyDriver, driver);

    // const pr = new ProjectRepository(driver);
    // const tr = new TaskRepository(driver);

    const pr = container.resolve<ProjectRepository>(ProjectRepository) as ProjectRepository;
    const tr = container.resolve<TaskRepository>(TaskRepository) as TaskRepository;

    const od = new repository.OperationDescription("1234567890", driver.parseId("123456789012345678901234"), "00a05436b8064e0a8553d58f8bdd3064", "/api/mission-vnext/tasks");
    // const p1: ProjectEntity = {
    //     name: "项目1"
    // };
    // await pr.save(od, p1); 
    // console.log(JSON.stringify(p1, null, 2));

    // const tasks: TaskEntity[] = [
    //     {
    //         project_id: p1._id,
    //         title: "任务1"
    //     },
    //     {
    //         project_id: p1._id,
    //         title: "任务2"
    //     },
    //     {
    //         project_id: p1._id,
    //         title: "任务3"
    //     }
    // ];
    // await tr.save(od, tasks);
    // console.log(JSON.stringify(tasks, null, 2));

    const ts = await tr.findByPageIndex(od,
        {
            project_id: tr.driver.parseId("5bbd633112939e345e73b6c4")
        }, undefined, undefined,
        {
            includes: {
                deleted: is.yes,
                // archived: is.yes
            }
        }
    );
    console.log(JSON.stringify(ts, null, 2));

    // await tr.archive(od, 2, {
    //     _id: driver.parseId("5bbd633112939e345e73b6c6")
    // });


    // const tasks = await repo.findByPageIndex(od);
    // console.log(JSON.stringify(tasks, null, 2));
    // console.log(repo.ping());

    await client.close();

})()
    .then(() => {
        console.log("done");
    })
    .catch(error => {
        console.log("fail");
        console.log(error);
    });