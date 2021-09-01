import {assert} from "chai";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {Refs} from "polar-shared/src/metadata/Refs";
import {Texts} from "polar-shared/src/metadata/Texts";
import {TextType} from "polar-shared/src/metadata/TextType";
import {ITextConverters} from "../annotation_sidebar/DocAnnotations";
import {Flashcards} from "../metadata/Flashcards";
import {FlashcardAnnotationContent, TextHighlightAnnotationContent} from "./content/AnnotationContent";
import {DateContent} from "./content/DateContent";
import {MarkdownContent} from "./content/MarkdownContent";
import {NameContent} from "./content/NameContent";
import {BlockTextContentUtils} from "./NoteUtils";


describe('BlockTextContentUtils', () => {
    const date = new DateContent({
        data: '2020-11-20',
        format: 'YYYY-MM-DD',
        type: 'date',
    });

    const name = new NameContent({
        data: 'Dog',
        type: 'name',
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
        value: {
            text: 'hello world',
            id: 'id',
            guid: 'id',
            notes: {},
            rects: {},
            images: {},
            created: 'date',
            questions: {},
            flashcards: {},
            lastUpdated: 'date',
            textSelections: {}, 
        },
    });

    const ref = Refs.create('potato', 'flashcard');
    const clozeFlashcard = new FlashcardAnnotationContent({
        type: AnnotationContentType.FLASHCARD,
        docID: 'fingerprint',
        pageNum: 11,
        value: Flashcards.createCloze('Hello', ref, 'MARKDOWN')
    });
    const frontBackFlashcard = new FlashcardAnnotationContent({
        type: AnnotationContentType.FLASHCARD,
        docID: 'fingerprint',
        pageNum: 11,
        value: Flashcards.createFrontBack('', 'Hello', ref, 'MARKDOWN')
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
                    revisedText: Texts.create('Text', TextType.MARKDOWN)
                }
            }));
        });
    });

    
    describe('updateClozeFlashcardContentMarkdown', () => {
        it('Should update the content of cloze flashcard blocks properly', () => {

            const newContent = BlockTextContentUtils.updateClozeFlashcardContentMarkdown(clozeFlashcard, 'Text');

            const JSONContent = clozeFlashcard.toJSON();
            assert.deepEqual(newContent, new FlashcardAnnotationContent({
                ...JSONContent,
                value: {
                    ...JSONContent.value,
                    fields: {
                        text: Texts.create('Text', TextType.MARKDOWN)
                    },
                },
            }));
        });
    });

    describe('updateFrontBackFlashcardContentMarkdown', () => {
        it('Should update the content of front/back flashcard blocks properly', () => {

            const newContent = BlockTextContentUtils.updateFrontBackFlashcardContentMarkdown(frontBackFlashcard, 'Text', 'front');

            const JSONContent = frontBackFlashcard.toJSON();
            assert.deepEqual(newContent, new FlashcardAnnotationContent({
                ...JSONContent,
                value: {
                    ...JSONContent.value,
                    fields: {
                        front: Texts.create('Text', TextType.MARKDOWN),
                        back: Texts.create('Hello', TextType.MARKDOWN),
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
            const text = ITextConverters.create(AnnotationType.TEXT_HIGHLIGHT, textHighlight.value).text || '';
            assert.deepEqual(BlockTextContentUtils.getTextContentMarkdown(textHighlight), text);
        });

        it('Should be able to get the text content of flashcard block contents', () => {
            const text = ITextConverters.create(AnnotationType.FLASHCARD, clozeFlashcard.value).text || '';
            assert.deepEqual(BlockTextContentUtils.getTextContentMarkdown(clozeFlashcard), text);
        });
    });
});
