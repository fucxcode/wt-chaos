import { assert } from "chai";
import { I18n, koaI18nMiddleware } from "../../src/i18n";
import Koa, { Context } from "koa";
import { Router, KoaContext, KoaRouter } from "../../src/router";
import { Server } from "http";
import supertest from "supertest";

class State {
    constructor() {}
}

const app = new Koa();
const router: Router<KoaContext<State>, State> = new KoaRouter(app, "/api");
router.proxy = true;
app.use(
    koaI18nMiddleware(app, {
        domain: ".worktile.com",
        directory: __dirname + "/locales"
    })
);

describe("i18n-koa", () => {
    let server: Server;
    let agent: supertest.SuperTest<supertest.Test>;
    before(() => {
        server = app.listen();
        agent = supertest(server);

        app.use(function(ctx: Context) {
            const i18n = (ctx as any).i18n;

            ctx.body = {
                locale: i18n.getLocale(),
                title: i18n.__("TITLE")
            };
        });
    });

    after(() => {
        server.close();
    });

    it(`get /user get default locale`, () => {
        agent
            .get("/user")
            .expect("Content-Type", /json/)
            // .expect("cookie", "lang=zh-cn; Path=/")
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
                const body = res.body;
                assert.isNotNull(body);
                assert.equal(body.locale, "zh-cn");
                assert.equal(body.title, "标题");
            });
    });

    it(`get /en-us/user`, () => {
        agent
            .get("/en-us/user")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
                const body = res.body;
                assert.isNotNull(body);
                assert.equal(body.locale, "en-us");
                assert.equal(body.title, "Title");
            });
    });

    it(`get /user with lang=en-us in cookie`, () => {
        agent
            .get("/en-us/user")
            // .set("")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
                const body = res.body;
                assert.isNotNull(body);
                assert.equal(body.locale, "en-us");
                assert.equal(body.title, "Title");
            });
    });
});
