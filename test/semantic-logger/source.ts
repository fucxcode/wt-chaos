import { Provider, Reporter, OutPut, Level, ProviderController } from "../../src/semantic-logger";

export interface Action {
    task: string;
    tag: string;
    keyword: string;
}

export class TestProvider extends Provider<Action> {
    constructor() {
        super("test");
        this.set("task", "test");
        this.set("tag", "opcode");
    }
}

export class TestReporter implements Reporter {
    public storage: any[];

    constructor() {
        this.storage = [];
    }

    public async report<T>(entity: OutPut<T>): Promise<OutPut<T>> {
        this.storage.push(entity);
        return Promise.resolve(entity);
    }
}

export const testReporter = new TestReporter();

export const controller = ProviderController.create("test.source", Level.verbose, [testReporter]);
