import { RouterContext, Router, RouterMiddleware, RouterHandler } from "../src/router";
import { IncomingHttpHeaders } from "http";
import { HttpMethod } from "../src/constants";
import * as _ from "../src/utilities";
import { facade, route, middlewares } from "../src/facade";
import * as uuid from "node-uuid";
import { assert } from "chai";
import { Cookies } from "../src/router/cookies";
import { ContainerPool } from "../src/container";
import { OperationContext } from "../src/router/operation-context";

describe("facade", () => {

    class TestOperationContext extends OperationContext {

        private _traces: string[];
        public get traces(): string[] {
            return this._traces;
        }

        constructor() {
            super();
            this._traces = [];
        }

    }

    class TestContext extends RouterContext<TestOperationContext> {

        private _operationContext: TestOperationContext;

        public get operationContext(): TestOperationContext {
            return this._operationContext;
        }

        public get requestBody(): any {
            throw new Error("not implemented");
        }

        public get responseBody(): any {
            throw new Error("not implemented");
        }

        public get method(): HttpMethod {
            throw new Error("not implemented");
        }


        public get path(): string {
            throw new Error("not implemented");
        }

        public get hostname(): string {
            throw new Error("not implemented");
        }

        public get originalUrl(): string {
            throw new Error("not implemented");
        }

        public get statusCode(): number {
            throw new Error("not implemented");
        }

        public get cookies(): Cookies {
            throw new Error("not implemented");
        }

        public get ip(): string {
            throw new Error("not implemented");
        }

        public get ips(): string[] {
            throw new Error("not implemented");
        }

        public get host(): string {
            throw new Error("not implemented");
        }

        public get protocol(): string {
            throw new Error("not implemented");
        }

        public redirect(url: string, alt?: string): void {
            throw new Error("not implemented.");
        }

        constructor(operationContext: TestOperationContext) {
            super();
            this._operationContext = operationContext;
        }

        public get headers(): IncomingHttpHeaders {
            throw new Error("not implemented");
        }

        public get query(): any {
            throw new Error("not implemented");
        }

        public get params(): any {
            throw new Error("not implemented");
        }

        public get body(): any {
            throw new Error("not implemented");
        }

        public json(data: any): TestContext {
            throw new Error("not implemented");
        }

    }

    class RouteEntry {

        constructor(
            public method: HttpMethod,
            public path: string,
            public middlewares: RouterMiddleware<TestContext, TestOperationContext>[],
            public handler: RouterHandler<TestContext, TestOperationContext>
        ) { }

    }

    class TestRouter extends Router<TestContext, TestOperationContext> {

        private _routes: RouteEntry[];
        public get routes(): RouteEntry[] {
            return this._routes;
        }

        constructor(prefix: string = "") {
            super(prefix, false);

            this._routes = [];
        }

        public get proxy(): boolean {
            throw new Error("not implemented");
        }
        public set proxy(value: boolean) {
            throw new Error("not implemented");
        }

        protected onUse(handler: RouterMiddleware<TestContext, TestOperationContext>): void {
            throw new Error("not implemented");
        }

        protected onRoute(method: HttpMethod, path: string, middlewares: RouterMiddleware<TestContext, TestOperationContext>[], handler: RouterHandler<TestContext, TestOperationContext>): void {
            this._routes.push(new RouteEntry(method, path, middlewares, handler));
        }

        public clear(): void {
            this._routes = [];
        }

        public async receive(path: string, method: HttpMethod, operationContext: TestOperationContext): Promise<void> {
            const context = new TestContext(operationContext);
            const entry = _.find(this._routes, r => r.method === method && r.path === path);
            if (entry) {
                for (const middleware of entry.middlewares) {
                    await middleware(context, () => Promise.resolve());
                }
                await entry.handler(context);
            }
            else {
                throw new Error((404).toString());
            }
        }

    }

    const router = new TestRouter();

    beforeEach(async () => {
        ContainerPool.clearContainers();
        ContainerPool.registerContainer();
        router.clear();
    });

    it(`facade route: no, facade middleware: no, method route: match, method middleware no. > handler: yes`, async () => {

        const expect_traces: string[] = [
            uuid.v4()
        ];
        const state = new TestOperationContext();

        @facade(router)
        // @ts-ignore
        class TestFacade {

            @route("/handler1", HttpMethod.GET)
            // @ts-ignore
            public async handler1(ctx: Context<TestOperationContext>): Promise<void> {
                ctx.operationContext.traces.push(expect_traces[0]);
            }

        }

        ContainerPool.getDefaultContainer().resolve<TestFacade>(TestFacade);
        await router.receive("/handler1", HttpMethod.GET, state);

        assert.strictEqual(state.traces.length, expect_traces.length);
        for (let i = 0; i < state.traces.length; i++) {
            const actual_trace = state.traces[i];
            const expect_trace = expect_traces[i];
            assert.strictEqual(actual_trace, expect_trace);
        }

    });

    it(`facade route: no, facade middleware: no, method route: path mismatch, method middleware no. > handler: error`, async () => {

        const state = new TestOperationContext();

        @facade(router)
        // @ts-ignore
        class TestFacade {

            @route("/handler1", HttpMethod.GET)
            // @ts-ignore
            public async handler1(ctx: Context<TestOperationContext>): Promise<void> {
                throw new Error("not implemented");
            }

        }

        ContainerPool.getDefaultContainer().resolve<TestFacade>(TestFacade);
        try {
            await router.receive("/handler1_miss", HttpMethod.GET, state);
            assert.fail();
        }
        catch (error) {
            assert.ok(error);
            assert.strictEqual(error.message, (404).toString());
        }

    });

    it(`facade route: no, facade middleware: no, method route: method mismatch, method middleware no. > handler: error`, async () => {

        const state = new TestOperationContext();

        @facade(router)
        // @ts-ignore
        class TestFacade {

            @route("/handler1", HttpMethod.GET)
            // @ts-ignore
            public async handler1(ctx: Context<TestOperationContext>): Promise<void> {
                throw new Error("not implemented");
            }

        }

        ContainerPool.getDefaultContainer().resolve<TestFacade>(TestFacade);
        try {
            await router.receive("/handler1", HttpMethod.PUT, state);
            assert.fail();
        }
        catch (error) {
            assert.ok(error);
            assert.strictEqual(error.message, (404).toString());
        }

    });

    it(`facade route: yes, facade middleware: no, method route: match, method middleware no. > handler: yes`, async () => {

        const expect_traces: string[] = [
            uuid.v4()
        ];
        const state = new TestOperationContext();

        @facade(router)
        @route("api")
        // @ts-ignore
        class TestFacade {

            @route("/handler1", HttpMethod.GET)
            // @ts-ignore
            public async handler1(ctx: Context<TestOperationContext>): Promise<void> {
                ctx.operationContext.traces.push(expect_traces[0]);
            }

        }

        ContainerPool.getDefaultContainer().resolve<TestFacade>(TestFacade);
        await router.receive("/api/handler1", HttpMethod.GET, state);
        assert.strictEqual(state.traces.length, expect_traces.length);
        for (let i = 0; i < state.traces.length; i++) {
            const actual_trace = state.traces[i];
            const expect_trace = expect_traces[i];
            assert.strictEqual(actual_trace, expect_trace);
        }

    });

    it(`facade route: yes w/ splitter, facade middleware: no, method route: w/ splitter match, method middleware no. > handler: yes`, async () => {

        const expect_traces: string[] = [
            uuid.v4()
        ];
        const state = new TestOperationContext();

        @facade(router)
        @route("api/v1/test")
        // @ts-ignore
        class TestFacade {

            @route("/handler/1", HttpMethod.GET)
            // @ts-ignore
            public async handler1(ctx: Context<TestOperationContext>): Promise<void> {
                ctx.operationContext.traces.push(expect_traces[0]);
            }

        }

        ContainerPool.getDefaultContainer().resolve<TestFacade>(TestFacade);
        await router.receive("/api/v1/test/handler/1", HttpMethod.GET, state);
        assert.strictEqual(state.traces.length, expect_traces.length);
        for (let i = 0; i < state.traces.length; i++) {
            const actual_trace = state.traces[i];
            const expect_trace = expect_traces[i];
            assert.strictEqual(actual_trace, expect_trace);
        }

    });

    it(`facade route: no, facade middleware: no, method route: same, method middleware no. > handler: different handler`, async () => {

        const expect_traces_get: string[] = [
            uuid.v4()
        ];
        const expect_traces_put: string[] = [
            uuid.v4()
        ];
        const state_get = new TestOperationContext();
        const state_put = new TestOperationContext();

        @facade(router)
        // @ts-ignore
        class TestFacade {

            @route("/handler", HttpMethod.GET)
            // @ts-ignore
            public async handler_get(ctx: Context<TestOperationContext>): Promise<void> {
                ctx.operationContext.traces.push(expect_traces_get[0]);
            }

            @route("/handler", HttpMethod.PUT)
            // @ts-ignore
            public async handler_put(ctx: Context<TestOperationContext>): Promise<void> {
                ctx.operationContext.traces.push(expect_traces_put[0]);
            }

        }

        ContainerPool.getDefaultContainer().resolve<TestFacade>(TestFacade);
        await router.receive("/handler", HttpMethod.GET, state_get);
        await router.receive("/handler", HttpMethod.PUT, state_put);

        assert.strictEqual(state_get.traces.length, expect_traces_get.length);
        for (let i = 0; i < state_get.traces.length; i++) {
            const actual_trace = state_get.traces[i];
            const expect_trace = expect_traces_get[i];
            assert.strictEqual(actual_trace, expect_trace);
        }

        assert.strictEqual(state_put.traces.length, expect_traces_put.length);
        for (let i = 0; i < state_put.traces.length; i++) {
            const actual_trace = state_put.traces[i];
            const expect_trace = expect_traces_put[i];
            assert.strictEqual(actual_trace, expect_trace);
        }

    });

    it(`facade middleware: multi, method middleware multi. > handler: middlewares then handler`, async () => {

        const expect_traces: string[] = [
            uuid.v4(),
            uuid.v4(),
            uuid.v4(),
            uuid.v4(),
            uuid.v4(),
            uuid.v4(),
            uuid.v4(),
            uuid.v4(),
            uuid.v4()
        ];
        const state = new TestOperationContext();

        @facade(router)
        @middlewares(
            async (ctx: RouterContext<TestOperationContext>) => {
                ctx.operationContext.traces.push(expect_traces[0]);
            },
            async (ctx: RouterContext<TestOperationContext>) => {
                ctx.operationContext.traces.push(expect_traces[1]);
            }
        )
        @middlewares(
            async (ctx: RouterContext<TestOperationContext>) => {
                ctx.operationContext.traces.push(expect_traces[2]);
            },
            async (ctx: RouterContext<TestOperationContext>) => {
                ctx.operationContext.traces.push(expect_traces[3]);
            }
        )
        // @ts-ignore
        class TestFacade {

            @route("/handler", HttpMethod.GET)
            @middlewares(
                async (ctx: RouterContext<TestOperationContext>) => {
                    ctx.operationContext.traces.push(expect_traces[4]);
                },
                async (ctx: RouterContext<TestOperationContext>) => {
                    ctx.operationContext.traces.push(expect_traces[5]);
                }
            )
            @middlewares(
                async (ctx: RouterContext<TestOperationContext>) => {
                    ctx.operationContext.traces.push(expect_traces[6]);
                },
                async (ctx: RouterContext<TestOperationContext>) => {
                    ctx.operationContext.traces.push(expect_traces[7]);
                }
            )
            // @ts-ignore
            public async handler(ctx: Context<TestOperationContext>): Promise<void> {
                ctx.operationContext.traces.push(expect_traces[8]);
            }


        }

        ContainerPool.getDefaultContainer().resolve<TestFacade>(TestFacade);
        await router.receive("/handler", HttpMethod.GET, state);

        assert.strictEqual(state.traces.length, expect_traces.length);
        for (let i = 0; i < state.traces.length; i++) {
            const actual_trace = state.traces[i];
            const expect_trace = expect_traces[i];
            assert.strictEqual(actual_trace, expect_trace);
        }

    });

    it(`facade middleware: sub-classes. > handler: parent and sub middlewares then handler`, async () => {

        const expect_traces: string[] = [
            uuid.v4(),
            uuid.v4(),
            uuid.v4(),
            uuid.v4(),
            uuid.v4(),
            uuid.v4(),
            uuid.v4()
        ];
        const state = new TestOperationContext();

        @facade(router)
        @middlewares(
            async (ctx: RouterContext<TestOperationContext>) => {
                ctx.operationContext.traces.push(expect_traces[0]);
            }
        )
        @middlewares(
            async (ctx: RouterContext<TestOperationContext>) => {
                ctx.operationContext.traces.push(expect_traces[1]);
            }
        )
        // @ts-ignore
        class Class1 {
        }

        @facade(router)
        @middlewares(
            async (ctx: RouterContext<TestOperationContext>) => {
                ctx.operationContext.traces.push(expect_traces[2]);
            }
        )
        @middlewares(
            async (ctx: RouterContext<TestOperationContext>) => {
                ctx.operationContext.traces.push(expect_traces[3]);
            }
        )
        // @ts-ignore
        class Class2 extends Class1 {
        }

        @facade(router)
        @middlewares(
            async (ctx: RouterContext<TestOperationContext>) => {
                ctx.operationContext.traces.push(expect_traces[4]);
            }
        )
        @middlewares(
            async (ctx: RouterContext<TestOperationContext>) => {
                ctx.operationContext.traces.push(expect_traces[5]);
            }
        )
        // @ts-ignore
        class Class3 extends Class2 {
            @route("/handler", HttpMethod.GET)
            // @ts-ignore
            public async handler(ctx: Context<TestOperationContext>): Promise<void> {
                ctx.operationContext.traces.push(expect_traces[6]);
            }
        }

        ContainerPool.getDefaultContainer().resolve<Class3>(Class3);
        await router.receive("/handler", HttpMethod.GET, state);

        assert.strictEqual(state.traces.length, expect_traces.length);
        for (let i = 0; i < state.traces.length; i++) {
            const actual_trace = state.traces[i];
            const expect_trace = expect_traces[i];
            assert.strictEqual(actual_trace, expect_trace);
        }

    });

    it(`facade route: sub-classes. > handler: parent and sub route path appended then handler`, async () => {

        const expect_traces: string[] = [
            uuid.v4()
        ];
        const state = new TestOperationContext();

        @facade(router)
        @route("/cls1")
        // @ts-ignore
        class Class1 {
        }

        @facade(router)
        @route("/cls2")
        // @ts-ignore
        class Class2 extends Class1 {
        }

        @facade(router)
        @route("/cls3")
        // @ts-ignore
        class Class3 extends Class2 {
            @route("/handler", HttpMethod.GET)
            // @ts-ignore
            public async handler(ctx: Context<TestOperationContext>): Promise<void> {
                ctx.operationContext.traces.push(expect_traces[0]);
            }
        }

        ContainerPool.getDefaultContainer().resolve<Class3>(Class3);
        await router.receive("/cls1/cls2/cls3/handler", HttpMethod.GET, state);

        assert.strictEqual(state.traces.length, expect_traces.length);
        for (let i = 0; i < state.traces.length; i++) {
            const actual_trace = state.traces[i];
            const expect_trace = expect_traces[i];
            assert.strictEqual(actual_trace, expect_trace);
        }

    });

});