import {assert} from 'chai';
import { AutoClozeDeletions } from 'polar-backend-api/src/api/AutoClozeDeletion';
import { AutoClozeDeletion } from './AutoClozeDeletionFunction';

import AutoClozeDeletionResponse = AutoClozeDeletions.AutoClozeDeletionResponse;

describe('AutoClozeDeletion', function() {

    it("Generates cloze deletion texts", async () => {
        const expectedClozeDeletion = "{{c1::Machine learning}} is the study of {{c2::computer algorithms}} that can improve automatically through {{c3::experience}}";

        const { text } = <AutoClozeDeletionResponse> await AutoClozeDeletion.analyzeText(
            "Machine learning is the study of computer algorithms that can improve automatically through experience"
        );

        assert.equal(text, expectedClozeDeletion);
    });

    it("Debugging multiple replacements...", async () => {
        const { text, GCLResponse } = <AutoClozeDeletionResponse> await AutoClozeDeletion.analyzeText(
            `For example, a recent analysis reported the overall mean antioxidant content of plant foods to be 11.57 mmolI100 gj1. Compare this to the mean antioxidant content of animal foods V a minute 0.18 mmolI100 gj1`
        );

        console.log(text);

        console.table(GCLResponse.entities);
    });
});
