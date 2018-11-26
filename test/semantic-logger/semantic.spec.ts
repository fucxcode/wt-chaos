import { TestProvider, controller, testReporter } from "./source";
import * as assert from "assert";
import { ProviderController, Level } from "../../src/semantic-logger";

describe("Provider test suits", () => {
    let testProvider: TestProvider;

    beforeEach(() => {
        testProvider = new TestProvider();
        testProvider.register(controller);
    });

    it("1. provider properties", () => {
        assert.ok(testProvider.channel === "test", "provider channel error");
        assert.ok(testProvider.enabled === true, "provider enabled error");
        assert.ok(testProvider.ctrl instanceof ProviderController, "registed to controller error");

        assert.doesNotThrow(() => {
            testProvider.channel === "anthor";
        }, "the channel name not read only");

        assert.deepEqual(testProvider.getEntity().toJSON(), { task: "test", tag: "opcode" }, "entity setting error");
    });

    it("2. set provider properties", () => {
        assert.ok(testProvider.ctrl !== undefined, "provider's set controller error");
        testProvider.set("keyword", "success");
        testProvider.disable();

        assert.ok(!testProvider.enabled, "provider can not be disabled");

        assert.deepEqual(
            testProvider.getEntity().toJSON(),
            {
                task: "test",
                tag: "opcode",
                keyword: "success"
            },
            "set internal metaEntity error"
        );
    });

    it("3. log function report interface", () => {
        testProvider.log(Level.warn, "xxxxx", "hello");
        assert.ok(testReporter.storage.length === 1, "the message can not be reported");
    });

    it("4: controller#getLogger", () => {
        assert.deepEqual(controller.getLogger("test"), testProvider, "getLogger fail");
    });

    it("5: controller#addProvider and #removeProvider", () => {
        assert.ok(controller.removeProvider("test") === true, "Can not remove the provider");
        controller.addProvider("test", testProvider);
        assert.deepEqual(controller.getLogger("test"), testProvider, "can not add provider to controller");
    });

    it("6: constroller#hasProvider", () => {
        assert.ok(controller.hasProvider("test") === true, "controller does not has provider");
    });

    // TODO: more test case
});
