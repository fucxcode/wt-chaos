
import { $ } from "../$";
import * as fs from "fs";
import * as assert from "assert";
import { _ } from "../../src";
import {TplResolver, TPLConfig, TPLOptions} from "../../src/mailer";

describe("#tpl-resolver", function () {
    let tpl: TplResolver;

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
        tpl = new TplResolver({
            layout: __dirname + "/layout",
            template: __dirname + "/template",
            sender: {
                noreply: noreply,
                service: service
            }
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

    it("#subject, from, to", async () => {
        const exceptedSubject = $.randomString();
        const exceptedTo = $.randomString();
        const options = new TPLOptions(exceptedSubject, exceptedTo, {}, "template.html", "layout.html");
        const mailOptions = await tpl.resolveOptions(options);

        assert.equal(mailOptions.subject, exceptedSubject);
        assert.equal(mailOptions.from, noreply);
        assert.equal(mailOptions.to, exceptedTo);
    });

    it("#read template", async () => {
        const options = new TPLOptions($.randomString(), $.randomString(), {}, "template.html", "layout.html");
        const mailOptions = await tpl.resolveOptions(options);
        assert.equal(_.isNil((<string>mailOptions.html).match(templateKey)), false);
    });

    it("#read layout", async () => {
        const options = new TPLOptions($.randomString(), $.randomString(), {}, "template.html", "layout.html");
        const mailOptions = await tpl.resolveOptions(options);
        assert.equal(_.isNil((<string>mailOptions.html).match(layoutKey)), false);
    });

    it("render data", async () => {
        const exceptedRenderData = $.randomString();
        const options = new TPLOptions($.randomString(),$.randomString(), { templateData: exceptedRenderData }, "template.html", "layout.html");
        const mailOptions = await tpl.resolveOptions(options);
        assert.equal(_.isNil((<string>mailOptions.html).match(exceptedRenderData)), false);
    });

    // after(() => {
    //     fs.unlinkSync(__dirname + "/template/template.html");
    //     fs.unlinkSync(__dirname + "/layout/layout.html");
    // });
}); 