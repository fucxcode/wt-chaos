import { assert } from "chai";
import { I18nLoader, II18nAdapter } from "../../src/i18n";

class TestII18nAdapter implements II18nAdapter {
    __(key: string, locale?: string): string {
        return "";
    }
    get(key: string, locale?: string): string {
        return this.__(key, locale);
    }
    setLocale(locale: string): void {}
}

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

describe("i18n template", () => {
    it(`load default locale mission template when directory = "{__dirname}/templates"`, () => {
        const loader = new I18nLoader(
            new TestII18nAdapter(),
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
        const loader = new I18nLoader(
            new TestII18nAdapter(),
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
        const loader = new I18nLoader(
            new TestII18nAdapter(),
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
