import { ValidationFailed, VerifyTokenEmail } from "./VerifyTokenEmail";
import { assert } from "chai";

describe("VerifyTokenEmail", () => {
    it("Validate no challenge found", async () => {
        const validationResult = <ValidationFailed>await VerifyTokenEmail.validateChallenge({
            challenge: "123456",
            newEmail: "testing+should-not-exist@getpolarized.io"
        });
        
        assert.isTrue(validationResult.failed);
        assert.equal(validationResult.code, 'no-email-for-challenge');
    });

    it("Validate incorrect challenge code", async () => {
        
        const validationResult = <ValidationFailed>await VerifyTokenEmail.validateChallenge({
            challenge: "INVALID-CHALLENGE",
            newEmail: "testing@getpolarized.io"
        });
        
        assert.isTrue(validationResult.failed);
        assert.equal(validationResult.code, "invalid-challenge");
    });

    it("Validate correct challenge code", async () => {
        const validationResult = await VerifyTokenEmail.validateChallenge({
            challenge: "123456",
            newEmail: "testing@getpolarized.io"
        });
        
        assert.isFalse(validationResult.failed);
    });
});