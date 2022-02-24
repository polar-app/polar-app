import {assert} from 'chai';
import {AutoClozeDeletions} from 'polar-backend-api/src/api/AutoClozeDeletion';
import {AutoClozeDeletion} from './AutoClozeDeletionFunction';
import AutoClozeDeletionResponse = AutoClozeDeletions.AutoClozeDeletionResponse;
import _createClozeWithinText = AutoClozeDeletion._createClozeWithinText;

describe('AutoClozeDeletion', function() {

    describe("_createClozeWithinText", () => {

        it("basic", () => {

            const text = "hello world";
            const start = 6;
            const end = start + 'world'.length;
            const result = _createClozeWithinText(text, start, end, 1);
            assert.equal(result, "hello {{c1::world}}");

        });

    });

    it("Generates cloze deletion texts", async () => {
        const expectedClozeDeletion = "{{c1::Machine learning}} is the {{c2::study}} of {{c3::computer algorithms}} that can improve automatically through {{c4::experience}}";

        const { text } = <AutoClozeDeletionResponse> await AutoClozeDeletion.analyzeText(
            "Machine learning is the study of computer algorithms that can improve automatically through experience"
        );

        assert.equal(text, expectedClozeDeletion);
    });


    it("Generates cloze deletion texts", async () => {
        const expectedClozeDeletion = "{{c1::Machine learning}} is the {{c2::study}} of {{c3::computer algorithms}} that can improve automatically through {{c4::experience}}";

        const { text } = <AutoClozeDeletionResponse> await AutoClozeDeletion.analyzeText(
            "Machine learning is the study of computer algorithms that can improve automatically through experience"
        );

        assert.equal(text, expectedClozeDeletion);
    });

    it("Cloze deletion with duplicated salient terms", async () => {

        const expectedClozeDeletion = "For {{c1::example}}, a recent {{c2::analysis}} reported the overall mean antioxidant {{c3::content}} of {{c4::plant foods}} to be {{c5::11.57}} {{c6::mmolI100 gj1}}. Compare this to the mean antioxidant {{c7::content}} of {{c8::animal foods}} V a minute {{c9::0.18}} {{c10::mmolI100 gj1}}";

        const { text } = <AutoClozeDeletionResponse> await AutoClozeDeletion.analyzeText(
            `For example, a recent analysis reported the overall mean antioxidant content of plant foods to be 11.57 mmolI100 gj1. Compare this to the mean antioxidant content of animal foods V a minute 0.18 mmolI100 gj1`
        );

        assert.equal(text, expectedClozeDeletion);
    });
});
