import * as sms from "../src/sms";
import { assert } from "chai";

describe("sms yunPian", () => {

    const appKey = "2034b8ccf138bc10f1f08464d32302d2";
    const messageTemplateId = "1812938";
    const codeTemplateId = "1810554";
    const mobile = "18801147312";
    let smsSender: sms.SmsSender;
    beforeEach(() => {
        const yunPianOption = {
            appKey: appKey,
            platform: "yunpian"
        };
        smsSender = sms.SmsSender.getInstance(yunPianOption);
    });


    it("send text message", async () => {
        const result = await smsSender.sendMessage(messageTemplateId, mobile, { teamDomain: "gonglinjie" });
        assert.equal(JSON.parse(result).code, 0);
    });

    it("send verification code message", async () => {
        const result = await smsSender.sendVerificationCode(codeTemplateId, mobile, "1234", 5);
        assert.equal(JSON.parse(result).code, 0);
    });

    it("send voice code message", async () => {
        const result = await smsSender.sendVoiceCode(mobile, "1234");
        assert.equal(JSON.parse(result).code, 0);
    });

});