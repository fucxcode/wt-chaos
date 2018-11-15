import { assert } from "chai";
import { I18n } from "../../src/i18n";

function _assertMissionFirstTask(
    mission: any,
    equalFirstTask: { _id: number; name: string }
) {
    assert.isNotNull(mission);
    assert.isArray(mission.tasks);
    assert.isNotEmpty(mission.tasks);
    const firstTask = mission.tasks[0];
    assert.isNotNull(firstTask);
    assert.equal(firstTask._id, equalFirstTask._id);
    assert.equal(firstTask.name, equalFirstTask.name);
}

describe("i18n", () => {
    let i18n: I18n;
    before(() => {
        i18n = new I18n(
            {
                directory: __dirname + "/locales",
                domain: ".worktile.com",
                locales: ["zh-cn", "en-us"]
            },
            null
        );
    });
    it(`get zh-cn TITLE is 标题`, () => {
        const title = i18n.__("TITLE", "zh-cn");
        assert.equal(title, "标题");
    });

    it(`get en-us TITLE is Title`, () => {
        const title = i18n.__("TITLE", "en-us");
        assert.equal(title, "Title");
    });

    it(`get mission.NAME is 任务`, () => {
        const title = i18n.__("mission.NAME", "zh-cn");
        assert.equal(title, "任务");
    });

    it(`get mission.DESC with %s params`, () => {
        const title = i18n.__("mission.DESC", "zh-cn", "参数");
        assert.equal(title, "参数 任务");
    });
});

describe("i18n template", () => {
    it(`load default locale mission template when directory = "{__dirname}/templates"`, () => {
        const loader = new I18n(
            {
                directory: __dirname + "/locales",
                domain: ".worktile.com"
            },
            {
                directory: __dirname + "/templates"
            }
        );
        const mission = loader.loadTemplate(`mission`);
        _assertMissionFirstTask(mission, {
            _id: 1,
            name: "第一个任务"
        });
    });

    it(`load en-us locale mission template when directory = "{__dirname}/templates"`, () => {
        const loader = new I18n(
            {
                directory: __dirname + "/locales",
                domain: ".worktile.com"
            },
            {
                directory: __dirname + "/templates"
            }
        );
        const mission = loader.loadTemplate(`mission`, "en-us");
        _assertMissionFirstTask(mission, {
            _id: 1,
            name: "My First Task"
        });
    });

    it(`load mission sub template mission.sub-module`, () => {
        const loader = new I18n(
            {
                directory: __dirname + "/locales",
                domain: ".worktile.com"
            },
            {
                directory: __dirname + "/templates"
            }
        );
        const mission = loader.loadTemplate(`mission.sub-module`);
        _assertMissionFirstTask(mission, {
            _id: 11,
            name: "第一个任务来自 sub-module"
        });
    });
});
