import {APKG} from 'polar-anki-apkg/src/index'

describe("Flashcard export", () => {
    it("generates flashcard", async () => {
        const apkg = new APKG({
            id: Date.now(),
            name: 'VocabularyBuilder',
            card: {
                fields: ['word', 'meaning', 'usage'],
                template: {
                    question: '{{word}}',
                    answer: `
                        <div class="word">{{word}}</div>
                        <div class="meaning">{{meaning}}</div>
                        <div class="usage">{{usage}}</div>
                    `
                }
            }
        })
    apkg.addCard({
        content: ['sample word', 'sample meaning', 'sample usage']
    })
    await apkg.save(__dirname);
    })
});
