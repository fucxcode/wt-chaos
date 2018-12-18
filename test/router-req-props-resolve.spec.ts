import { OperationContext, RouterRequest, resolve, RouterContext, fulfillRouterRequestProperties } from "../src/router";
import { assert } from "chai";
import * as TypeMoq from "typemoq";
import * as uuid from "node-uuid";
import * as _ from "../src/utilities";
import { Id } from "../src/repository";


describe("router request: resolve properties", () => {

    class TestOperationContext extends OperationContext {

    }

    class TestRouterRequest extends RouterRequest<TestOperationContext> {

        @resolve(ctx => ctx.requestBody.name)
        // @ts-ignore
        public name!: string;

        @resolve(ctx => ctx.headers["X-Worktile-Token"])
        // @ts-ignore
        public token!: string;

        public signature!: string;

    }

    class User {

        public name!: string;

        public token!: string;

    }

    class ComplexRouterRequest extends RouterRequest<TestOperationContext> {

        @resolve(ctx => {
            return {
                name: ctx.requestBody.name,
                token: ctx.headers["X-Worktile-Token"]
            };
        })
        // @ts-ignore
        public user!: User;

        public signature!: string;

    }

    it(`fulfill properties with @resolve decorated, not fulfilled if no @resolve`, async () => {
        const expect_team_id = _.randomString();
        const idMock = TypeMoq.Mock.ofType<Id>(undefined, TypeMoq.MockBehavior.Strict);
        idMock.setup(x => x.toString()).returns(() => expect_team_id).verifiable();
        const operationContext = new TestOperationContext(uuid.v4(), idMock.object, uuid.v4(), _.randomString());

        const expect_name = _.randomString();
        const expect_token = _.randomString();
        const contextMock = TypeMoq.Mock.ofType<RouterContext<TestOperationContext>>(undefined, TypeMoq.MockBehavior.Strict);
        contextMock.setup(x => x.operationContext).returns(() => operationContext).verifiable();
        contextMock.setup(x => x.requestBody).returns(() => {
            return {
                name: expect_name
            };
        }).verifiable();
        contextMock.setup(x => x.headers).returns(() => {
            return {
                "X-Worktile-Token": expect_token
            };
        }).verifiable();

        const request = new TestRouterRequest();
        fulfillRouterRequestProperties(request, contextMock.object);
        contextMock.verifyAll();

        assert.strictEqual(request.operationContext.oid, operationContext.oid);
        assert.strictEqual(request.operationContext.team.toString(), expect_team_id);
        assert.strictEqual(request.operationContext.uid, operationContext.uid);
        assert.strictEqual(request.operationContext.path, operationContext.path);
        assert.strictEqual(request.name, expect_name);
        assert.strictEqual(request.token, expect_token);
        assert.isUndefined(request.signature);
    });

    it(`pre-assigned properties should NOT be resolved`, async () => {
        const expect_team_id = _.randomString();
        const idMock = TypeMoq.Mock.ofType<Id>(undefined, TypeMoq.MockBehavior.Strict);
        idMock.setup(x => x.toString()).returns(() => expect_team_id).verifiable();
        const operationContext = new TestOperationContext(uuid.v4(), idMock.object, uuid.v4(), _.randomString());

        const expect_name = _.randomString();
        const expect_token = _.randomString();
        const contextMock = TypeMoq.Mock.ofType<RouterContext<TestOperationContext>>(undefined, TypeMoq.MockBehavior.Strict);
        contextMock.setup(x => x.operationContext).returns(() => operationContext).verifiable();
        contextMock.setup(x => x.requestBody).returns(() => {
            return {
                name: expect_name
            };
        }).verifiable();
        contextMock.setup(x => x.headers).returns(() => {
            return {
                "X-Worktile-Token": expect_token
            };
        }).verifiable(TypeMoq.Times.never());

        const request = new TestRouterRequest();
        const pre_assigned_token = _.randomString();
        request.token = pre_assigned_token;
        fulfillRouterRequestProperties(request, contextMock.object);
        contextMock.verifyAll();

        assert.strictEqual(request.operationContext.oid, operationContext.oid);
        assert.strictEqual(request.operationContext.team.toString(), expect_team_id);
        assert.strictEqual(request.operationContext.uid, operationContext.uid);
        assert.strictEqual(request.operationContext.path, operationContext.path);
        assert.strictEqual(request.name, expect_name);
        assert.strictEqual(request.token, pre_assigned_token);
        assert.isUndefined(request.signature);
    });

    it(`@resolve an object`, async () => {
        const expect_team_id = _.randomString();
        const idMock = TypeMoq.Mock.ofType<Id>(undefined, TypeMoq.MockBehavior.Strict);
        idMock.setup(x => x.toString()).returns(() => expect_team_id).verifiable();
        const operationContext = new TestOperationContext(uuid.v4(), idMock.object, uuid.v4(), _.randomString());

        const expect_name = _.randomString();
        const expect_token = _.randomString();
        const contextMock = TypeMoq.Mock.ofType<RouterContext<TestOperationContext>>(undefined, TypeMoq.MockBehavior.Strict);
        contextMock.setup(x => x.operationContext).returns(() => operationContext).verifiable();
        contextMock.setup(x => x.requestBody).returns(() => {
            return {
                name: expect_name
            };
        }).verifiable();
        contextMock.setup(x => x.headers).returns(() => {
            return {
                "X-Worktile-Token": expect_token
            };
        }).verifiable();

        const request = new ComplexRouterRequest();
        fulfillRouterRequestProperties(request, contextMock.object);
        contextMock.verifyAll();

        assert.strictEqual(request.operationContext.oid, operationContext.oid);
        assert.strictEqual(request.operationContext.team.toString(), expect_team_id);
        assert.strictEqual(request.operationContext.uid, operationContext.uid);
        assert.strictEqual(request.operationContext.path, operationContext.path);
        assert.strictEqual(request.user.name, expect_name);
        assert.strictEqual(request.user.token, expect_token);
        assert.isUndefined(request.signature);
    });

});