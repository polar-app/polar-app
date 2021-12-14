import {assert} from "chai";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {FlashcardAnnotationContent, TextHighlightAnnotationContent} from "./content/AnnotationContent";
import {DateContent} from "./content/DateContent";
import {MarkdownContent} from "./content/MarkdownContent";
import {NameContent} from "./content/NameContent";
import {BlockFlashcards} from "polar-blocks/src/annotations/BlockFlashcards";
import {BlockTextContentUtils} from "./BlockTextContentUtils";


describe('BlockTextContentUtils', () => {
    const date = new DateContent({
        data: '2020-11-20',
        format: 'YYYY-MM-DD',
        type: 'date',
        links: [],
    });

    const name = new NameContent({
        data: 'Dog',
        type: 'name',
        links: [],
    });

    const markdown = new MarkdownContent({
        data: 'What is your [[name]]',
        type: 'markdown',
        links: [{ id: 'name', text: 'name' }],
    });

    const textHighlight = new TextHighlightAnnotationContent({
        type: AnnotationContentType.TEXT_HIGHLIGHT,
        docID: 'fingerprint',
        pageNum: 11,
        links: [],
        value: {
            text: 'hello world',
            rects: {},
            color: 'red',
        },
    });

    const clozeFlashcard = new FlashcardAnnotationContent({
        type: AnnotationContentType.FLASHCARD,
        docID: 'fingerprint',
        pageNum: 11,
        links: [],
        value: BlockFlashcards.createCloze('Hello')
    });
    const frontBackFlashcard = new FlashcardAnnotationContent({
        type: AnnotationContentType.FLASHCARD,
        docID: 'fingerprint',
        pageNum: 11,
        links: [],
        value: BlockFlashcards.createFrontBack('', 'Hello')
    });

    describe('updateTextContentMarkdown', () => {
        it('Should update the markdown content of date blocks properly', () => {

            const newContent = BlockTextContentUtils.updateTextContentMarkdown(date, '2020-12-23');

            assert.deepEqual(newContent, new DateContent({ ...date.toJSON(), data: '2020-12-23' }));
        });

        it('Should update the markdown content of name blocks properly', () => {

            const newContent = BlockTextContentUtils.updateTextContentMarkdown(name, 'Cat');

            assert.deepEqual(newContent, new NameContent({ ...name.toJSON(), data: 'Cat' }));
        });

        it('Should update the markdown content of markdown blocks properly', () => {

            const newContent = BlockTextContentUtils.updateTextContentMarkdown(markdown, 'Link [[name]]');

            assert.deepEqual(newContent, new MarkdownContent({ ...markdown.toJSON(), data: 'Link [[name]]' }));
        });

        it('Should update the content of text highlight blocks properly', () => {

            const newContent = BlockTextContentUtils.updateTextContentMarkdown(textHighlight, 'Text');

            const JSONContent = textHighlight.toJSON();
            assert.deepEqual(newContent, new TextHighlightAnnotationContent({
                ...JSONContent,
                value: {
                    ...JSONContent.value,
                    revisedText: 'Text',
                }
            }));
        });
    });


    describe('updateClozeFlashcardContentMarkdown', () => {
        it('Should update the content of cloze flashcard blocks properly', () => {

            const newContent = BlockTextContentUtils.updateFlashcardContentMarkdown(clozeFlashcard, 'text', 'Text');

            const JSONContent = clozeFlashcard.toJSON();
            assert.deepEqual(newContent, new FlashcardAnnotationContent({
                ...JSONContent,
                value: {
                    ...JSONContent.value,
                    type: FlashcardType.CLOZE,
                    fields: {
                        text: 'Text',
                    },
                },
            }));
        });
    });

    describe('updateFrontBackFlashcardContentMarkdown', () => {
        it('Should update the content of front/back flashcard blocks properly', () => {

            const newContent = BlockTextContentUtils.updateFlashcardContentMarkdown(frontBackFlashcard, 'front', 'Text');

            const JSONContent = frontBackFlashcard.toJSON();
            assert.deepEqual(newContent, new FlashcardAnnotationContent({
                ...JSONContent,
                value: {
                    ...JSONContent.value,
                    type: FlashcardType.BASIC_FRONT_BACK,
                    fields: {
                        front: 'Text',
                        back: 'Hello',
                    },
                },
            }));
        });
    });

    describe('getTextContentMarkdown', () => {
        it('Should be able to get the text content of date, name, & markdown block contents', () => {
            assert.deepEqual(BlockTextContentUtils.getTextContentMarkdown(date), date.data);
            assert.deepEqual(BlockTextContentUtils.getTextContentMarkdown(markdown), markdown.data);
            assert.deepEqual(BlockTextContentUtils.getTextContentMarkdown(name), name.data);
        });

        it('Should be able to get the text content of text annotation block contents', () => {
            const text = BlockTextHighlights.toText(textHighlight.value);
            assert.deepEqual(BlockTextContentUtils.getTextContentMarkdown(textHighlight), text);
        });

        it('Should be able to get the text content of flashcard block contents', () => {
            const text = clozeFlashcard.value.fields.text;
            assert.deepEqual(BlockTextContentUtils.getTextContentMarkdown(clozeFlashcard), text);
        });
    });
});
