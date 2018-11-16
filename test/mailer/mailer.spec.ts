import { MailConfig, IMail, Mailer, TemplateSetting } from "../../src/mailer";
import { $ } from "../$";
import * as fs from "fs";
import * as assert from "assert";
import { _ } from "../../src";

class TestMail implements IMail {

    private _invoked: boolean;
    public get invoked(): boolean {
        return this._invoked;
    }

    private _mailOptions: any;
    public get mailOptions() {
        return this._mailOptions;
    }

    public async sendMail(options: any) {
        this._invoked = true;
        this._mailOptions = options;
    }

}

describe("#mailer", function () {
    let mailer: Mailer;
    let testMail: TestMail;

    const noreply = $.randomString();
    const service = $.randomString();

    const layout: string = "<div>\
        {{> body }}\
         </div>\n";

    const template: string = "<div>\
            {{ templateData}}\
    </div>\n";

    let templateKey: string;
    let layoutKey: string;

    beforeEach(() => {
        testMail = new TestMail();
        mailer = new Mailer(testMail,
            {
                template: __dirname + "/template",
                layout: __dirname + "/layout",
                sender: { noreply: noreply, service: service }
            });

        templateKey = $.randomString();
        layoutKey = $.randomString();
        const templateTail = `<div>${templateKey}<div>`;
        const layoutTail = `<div>${layoutKey}<div>`;
        if (fs.existsSync(__dirname + "/template/template.html")) {
            fs.unlinkSync(__dirname + "/template/template.html");
            fs.unlinkSync(__dirname + "/layout/layout.html");
        }
        fs.writeFileSync(__dirname + "/template/template.html", template + templateTail);
        fs.writeFileSync(__dirname + "/layout/layout.html", layout + layoutTail);
    });

    it("#instance invoked, subject, from, to", async () => {
        const exceptedSubject = $.randomString();
        const setting = new TemplateSetting(exceptedSubject, "template.html", "layout.html");
        const exceptedTo = $.randomString();
        await mailer.send(setting, { templateData: $.randomString() }, exceptedTo);

        assert.equal(testMail.invoked, true);
        assert.equal(testMail.mailOptions.subject, exceptedSubject);
        assert.equal(testMail.mailOptions.from, noreply);
        assert.equal(testMail.mailOptions.to, exceptedTo);
    });

    it("#read template", async () => {
        const setting = new TemplateSetting($.randomString(), "template.html", "layout.html");
        await mailer.send(setting, { templateData: $.randomString() }, $.randomString());
        const options = testMail.mailOptions;
        layoutKey;
        assert.equal(_.isNil(options.html.match(templateKey)), false);
    });

    it("#read layout", async () => {
        const setting = new TemplateSetting($.randomString(), "template.html", "layout.html");
        await mailer.send(setting, { templateData: $.randomString() }, $.randomString());

        const options = testMail.mailOptions;

        assert.equal(_.isNil(options.html.match(layoutKey)), false);
    });

    it("render data", async () => {
        const exceptedRenderData = $.randomString();
        const setting = new TemplateSetting($.randomString(), "template.html");
        await mailer.send(setting, { templateData: exceptedRenderData }, $.randomString());
        const options = testMail.mailOptions;

        assert.equal(_.isNil(options.html.match(templateKey)), false);
    });

    after(() => {
        fs.unlinkSync(__dirname + "/template/template.html");
        fs.unlinkSync(__dirname + "/layout/layout.html");
    });
}); 