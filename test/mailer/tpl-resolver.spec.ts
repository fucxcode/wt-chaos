import { $ } from "../$";
import * as fs from "fs";
import * as assert from "assert";
import { _ } from "../../src";
import { TPLResolver, TPLConfig, TPLOptions } from "../../src/mailer";

describe("#tpl-resolver", function() {
    let tpl: TPLResolver;

    const noreply = _.randomString();
    const service = _.randomString();

    const layout: string = "<div>\
        {{> body }}\
         </div>\n";

    const template: string = "<div>\
            {{ templateData}}\
    </div>\n";

    let templateKey: string;
    let layoutKey: string;

    beforeEach(() => {
        tpl = new TPLResolver({
            layout: __dirname + "/layout",
            template: __dirname + "/template",
            sender: {
                noreply: noreply,
                service: service
            }
        });

        templateKey = _.randomString();
        layoutKey = _.randomString();
        const templateTail = `<div>${templateKey}<div>`;
        const layoutTail = `<div>${layoutKey}<div>`;
        if (fs.existsSync(__dirname + "/template/template.html")) {
            fs.unlinkSync(__dirname + "/template/template.html");
            fs.unlinkSync(__dirname + "/layout/layout.html");
        }
        fs.writeFileSync(
            __dirname + "/template/template.html",
            template + templateTail
        );
        fs.writeFileSync(
            __dirname + "/layout/layout.html",
            layout + layoutTail
        );
    });

    it("#subject, from, to", async () => {
        const exceptedSubject = _.randomString();
        const exceptedTo = _.randomString();
        const options = new TPLOptions(
            exceptedSubject,
            exceptedTo,
            {},
            "template.html",
            "layout.html"
        );
        const mailOptions = await tpl.resolveOptions(options);

        assert.equal(mailOptions.subject, exceptedSubject);
        assert.equal(mailOptions.from, noreply);
        assert.equal(mailOptions.to, exceptedTo);
    });

    it("#read template", async () => {
        const options = new TPLOptions(
            _.randomString(),
            _.randomString(),
            {},
            "template.html",
            "layout.html"
        );
        const mailOptions = await tpl.resolveOptions(options);
        assert.equal(
            _.isNil((<string>mailOptions.html).match(templateKey)),
            false
        );
    });

    it("#read layout", async () => {
        const options = new TPLOptions(
            _.randomString(),
            _.randomString(),
            {},
            "template.html",
            "layout.html"
        );
        const mailOptions = await tpl.resolveOptions(options);
        assert.equal(
            _.isNil((<string>mailOptions.html).match(layoutKey)),
            false
        );
    });

    it("render data", async () => {
        const exceptedRenderData = _.randomString();
        const options = new TPLOptions(
            _.randomString(),
            _.randomString(),
            { templateData: exceptedRenderData },
            "template.html",
            "layout.html"
        );
        const mailOptions = await tpl.resolveOptions(options);
        assert.equal(
            _.isNil((<string>mailOptions.html).match(exceptedRenderData)),
            false
        );
    });

    after(() => {
        fs.unlinkSync(__dirname + "/template/template.html");
        fs.unlinkSync(__dirname + "/layout/layout.html");
    });
});
