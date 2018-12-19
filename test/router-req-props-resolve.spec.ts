import { OperationContext, RouterRequest, resolve, RouterContext, fulfillRouterRequestProperties, body, param, query, header, cookie } from "../src/router";
import { assert } from "chai";
import * as TypeMoq from "typemoq";
import * as uuid from "node-uuid";
import * as _ from "../src/utilities";
import { Id, DriverExtensions, MongoDBDriver } from "../src/repository";
import { UID } from "../src/constants";
import { ContainerPool } from "../src/container";
import { MongoClient } from "mongodb";
import { Cookies, GetOption, SetOption } from "../src/router/cookies";


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

    it(`@body()`, async () => {
        class User {
            name: string;
            department: {
                location: string,
                name: string
            };
            skills: string[];
        }

        class UserRequest extends RouterRequest<TestOperationContext> {
            @body()
            // @ts-ignore
            public user!: User;
        }

        const expect_body = {
            name: _.randomString(),
            department: {
                location: "bj",
                name: "fp"
            },
            skills: [
                "JavaScript",
                "C#"
            ]
        };

        const contextMock = TypeMoq.Mock.ofType<RouterContext<TestOperationContext>>(undefined, TypeMoq.MockBehavior.Strict);
        contextMock.setup(x => x.operationContext).returns(() => new TestOperationContext()).verifiable();
        contextMock.setup(x => x.requestBody).returns(() => expect_body).verifiable();

        const request = new UserRequest();
        fulfillRouterRequestProperties(request, contextMock.object);

        assert.deepStrictEqual(request.user, expect_body);
    });

    it(`@body(args)`, async () => {

        class UserRequest extends RouterRequest<TestOperationContext> {
            @body("user.name")
            // @ts-ignore
            public userName: string;

            @body("user.department")
            // @ts-ignore
            public userDepartment: {
                location: string;
                name: string
            };

            @body("user.skills")
            // @ts-ignore
            public userSkills: string[];
        }

        const expect_body = {
            user: {
                name: _.randomString(),
                department: {
                    location: "bj",
                    name: "fp"
                },
                skills: [
                    "JavaScript",
                    "C#"
                ]
            }
        };

        const contextMock = TypeMoq.Mock.ofType<RouterContext<TestOperationContext>>(undefined, TypeMoq.MockBehavior.Strict);
        contextMock.setup(x => x.operationContext).returns(() => new TestOperationContext()).verifiable();
        contextMock.setup(x => x.requestBody).returns(() => expect_body).verifiable();

        const request = new UserRequest();
        fulfillRouterRequestProperties(request, contextMock.object);

        assert.strictEqual(request.userName, expect_body.user.name);
        assert.deepStrictEqual(request.userDepartment, expect_body.user.department);
        assert.deepStrictEqual(request.userSkills, expect_body.user.skills);
    });

    it(`@body(args, parser)`, async () => {

        class UserRequest extends RouterRequest<TestOperationContext> {
            @body("user.department", (input: string) => {
                const values = input.split(":");
                return {
                    location: values[0],
                    name: values[1]
                };
            })
            // @ts-ignore
            public userDepartment: {
                location: string;
                name: string
            };
        }

        const expect_body = {
            user: {
                department: "bj:fp"
            }
        };

        const contextMock = TypeMoq.Mock.ofType<RouterContext<TestOperationContext>>(undefined, TypeMoq.MockBehavior.Strict);
        contextMock.setup(x => x.operationContext).returns(() => new TestOperationContext()).verifiable();
        contextMock.setup(x => x.requestBody).returns(() => expect_body).verifiable();

        const request = new UserRequest();
        fulfillRouterRequestProperties(request, contextMock.object);

        assert.strictEqual(request.userDepartment.location, expect_body.user.department.split(":")[0]);
        assert.strictEqual(request.userDepartment.name, expect_body.user.department.split(":")[1]);
    });

    it(`@params(args)`, async () => {

        class UpdateUserRequest extends RouterRequest<TestOperationContext> {
            @param("teamId")
            // @ts-ignore
            public teamId: string;

            @param("uid")
            // @ts-ignore
            public uid: UID;
        }

        const expect_params = {
            teamId: _.randomString(),
            uid: uuid.v4()
        };

        const contextMock = TypeMoq.Mock.ofType<RouterContext<TestOperationContext>>(undefined, TypeMoq.MockBehavior.Strict);
        contextMock.setup(x => x.operationContext).returns(() => new TestOperationContext()).verifiable();
        contextMock.setup(x => x.params).returns(() => expect_params).verifiable();

        const request = new UpdateUserRequest();
        fulfillRouterRequestProperties(request, contextMock.object);

        assert.strictEqual(request.teamId, expect_params.teamId);
        assert.strictEqual(request.uid, expect_params.uid);
    });

    it(`@params(args, parser)`, async () => {

        const clientMock = TypeMoq.Mock.ofType<MongoClient>();
        const driver = new MongoDBDriver(clientMock.object, _.randomString());

        class UpdateUserRequest extends RouterRequest<TestOperationContext> {
            @param("teamId", id => driver.parseId(id, false))
            // @ts-ignore
            public teamId: Id;
        }

        const expect_params = {
            teamId: driver.parseId(undefined, true).toString()
        };

        const contextMock = TypeMoq.Mock.ofType<RouterContext<TestOperationContext>>(undefined, TypeMoq.MockBehavior.Strict);
        contextMock.setup(x => x.operationContext).returns(() => new TestOperationContext()).verifiable();
        contextMock.setup(x => x.params).returns(() => expect_params).verifiable();

        const request = new UpdateUserRequest();
        fulfillRouterRequestProperties(request, contextMock.object);

        assert.strictEqual(request.teamId.toString(), expect_params.teamId);
    });

    it(`@query(args) & @query(args, parser)`, async () => {

        class GetTasksRequest extends RouterRequest<TestOperationContext> {
            @query("pi", value => Number(value))
            // @ts-ignore
            public pageIndex: number;

            @query("ps", value => Number(value))
            // @ts-ignore
            public pageSize: number;

            @query("k")
            // @ts-ignore
            public keyword: string;
        }

        const expect_query = {
            pi: _.random(1, 100).toString(),
            ps: _.random(20, 40).toString(),
            k: _.randomString()
        };

        const contextMock = TypeMoq.Mock.ofType<RouterContext<TestOperationContext>>(undefined, TypeMoq.MockBehavior.Strict);
        contextMock.setup(x => x.operationContext).returns(() => new TestOperationContext()).verifiable();
        contextMock.setup(x => x.query).returns(() => expect_query).verifiable();

        const request = new GetTasksRequest();
        fulfillRouterRequestProperties(request, contextMock.object);

        assert.strictEqual(request.pageIndex, Number(expect_query.pi));
        assert.strictEqual(request.pageSize, Number(expect_query.ps));
        assert.strictEqual(request.keyword, expect_query.k);
    });

    it(`@header(args) & @header(args, parser)`, async () => {

        class GetTasksRequest extends RouterRequest<TestOperationContext> {
            @header("X-Worktile-Key")
            // @ts-ignore
            public appKey: string;

            @header("Content-Length", value => Number(value))
            // @ts-ignore
            public length: number;
        }

        const expect_headers = {
            "X-Worktile-Key": _.randomString(),
            "Content-Length": _.random(20, 40).toString()
        };

        const contextMock = TypeMoq.Mock.ofType<RouterContext<TestOperationContext>>(undefined, TypeMoq.MockBehavior.Strict);
        contextMock.setup(x => x.operationContext).returns(() => new TestOperationContext()).verifiable();
        contextMock.setup(x => x.headers).returns(() => expect_headers).verifiable();

        const request = new GetTasksRequest();
        fulfillRouterRequestProperties(request, contextMock.object);

        assert.strictEqual(request.length, Number(expect_headers["Content-Length"]));
        assert.strictEqual(request.appKey, expect_headers["X-Worktile-Key"]);
    });

    it(`@cookies(args) & @cookies(args, parser)`, async () => {

        class GetTasksRequest extends RouterRequest<TestOperationContext> {
            @cookie("sid")
            // @ts-ignore
            public sid: string;

            @cookie("seed", value => _.map(value, x => Number(x)))
            // @ts-ignore
            public seed: number[];
        }

        const expect_cookies = {
            "sid": _.randomString(),
            "seed": [
                _.random().toString(),
                _.random().toString(),
                _.random().toString()
            ]
        };
        const cookies: Cookies = {
            secure: true,
            get: (name: string, opts?: GetOption): string | string[] | undefined => {
                return expect_cookies[name];
            },
            set: (name: string, value?: string, opts?: SetOption): Cookies => this
        };

        const contextMock = TypeMoq.Mock.ofType<RouterContext<TestOperationContext>>(undefined, TypeMoq.MockBehavior.Strict);
        contextMock.setup(x => x.operationContext).returns(() => new TestOperationContext()).verifiable();
        contextMock.setup(x => x.cookies).returns(() => cookies).verifiable();
        contextMock.setup(x => x.cookies).returns(() => cookies).verifiable();

        const request = new GetTasksRequest();
        fulfillRouterRequestProperties(request, contextMock.object);

        assert.strictEqual(request.sid, expect_cookies.sid);
        assert.deepStrictEqual(request.seed, _.map(expect_cookies.seed, x => Number(x)));
    });
});