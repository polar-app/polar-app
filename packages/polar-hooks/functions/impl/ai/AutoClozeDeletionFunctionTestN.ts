import {assert} from 'chai';
import { AutoClozeDeletions } from 'polar-backend-api/src/api/AutoClozeDeletion';
import { AutoClozeDeletion } from './AutoClozeDeletionFunction';

import AutoClozeDeletionResponse = AutoClozeDeletions.AutoClozeDeletionResponse;

describe('AutoClozeDeletion', function() {

    xit("Generates cloze deletion texts", async () => {
        const expectedClozeDeletion = "{{c1::Machine learning}} is the study of {{c2::computer algorithms}} that can improve automatically through {{c3::experience}}";

        const { text } = <AutoClozeDeletionResponse> await AutoClozeDeletion.analyzeText(
            "Machine learning is the study of computer algorithms that can improve automatically through experience"
        );

        assert.equal(text, expectedClozeDeletion);
    });

    it("Cloze deletion with duplicated salient terms", async () => {

        const expectedClozeDeletion = "For {{c1::example}}, a recent {{c4::analysis}} reported the overall mean antioxidant {{c2::content}} of {{c3::plant foods}} to be {{c10::11.57}} {{c5::mmolI100 gj1}}. Compare this to the mean antioxidant {{c7::content}} of {{c6::animal foods}} V a minute {{c9::0.18}} {{c8::mmolI100 gj1}}";
        
        const { text } = <AutoClozeDeletionResponse> await AutoClozeDeletion.analyzeText(
            `For example, a recent analysis reported the overall mean antioxidant content of plant foods to be 11.57 mmolI100 gj1. Compare this to the mean antioxidant content of animal foods V a minute 0.18 mmolI100 gj1`
        );

        assert.equal(text, expectedClozeDeletion);
    });
});
