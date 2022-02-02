import {assert} from 'chai';
import { AutoClozeDeletionResponse } from 'polar-backend-api/src/api/AutoClozeDeletion';
import { AutoClozeDeletion } from './AutoClozeDeletionFunction';

describe('Auto Cloze Deletion', function() {

    it("Generates cloze deletion texts", async () => {
        const expectedClozeDeletions = [
            '{{c1::Machine learning}} is the study of computer algorithms that can improve automatically through experience',
            'Machine learning is the study of {{c1::computer algorithms}} that can improve automatically through experience',
            'Machine learning is the study of computer algorithms that can improve automatically through {{c1::experience}}'
        ];

        const { clozeDeletions } = <AutoClozeDeletionResponse> await AutoClozeDeletion.analyzeText(
            "Machine learning is the study of computer algorithms that can improve automatically through experience"
        );

        assert.deepEqual(clozeDeletions, expectedClozeDeletions);
    });
});