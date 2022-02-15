import {assert} from 'chai';
import { AutoClozeDeletionResponse } from 'polar-backend-api/src/api/AutoClozeDeletion';
import { AutoClozeDeletion } from './AutoClozeDeletionFunction';

describe('AutoClozeDeletion', function() {

    it("Generates cloze deletion texts", async () => {
        const expectedClozeDeletion = "{{c1::Machine learning}} is the study of {{c2::computer algorithms}} that can improve automatically through {{c3::experience}}";

        const { text } = <AutoClozeDeletionResponse> await AutoClozeDeletion.analyzeText(
            "Machine learning is the study of computer algorithms that can improve automatically through experience"
        );

        assert.equal(text, expectedClozeDeletion);
    });
});