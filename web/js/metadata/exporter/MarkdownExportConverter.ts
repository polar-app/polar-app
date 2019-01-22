import {Writable} from "./Exporter";
import {AnnotationHolder} from "../AnnotationHolder";
import {TextHighlight} from "../TextHighlight";
import {AreaHighlight} from '../AreaHighlight';
import {AbstractExportConverter} from './AbstractExportConverter';
import {Flashcard} from '../Flashcard';
import {Comment} from '../Comment';
import {Texts} from "../Texts";

export class MarkdownExportConverter extends AbstractExportConverter {

    public readonly id: string = 'markdown';

    protected async convertAreaHighlight(writer: Writable, areaHighlight: AreaHighlight, exportable: AnnotationHolder): Promise<void> {
        // noop

        const output =
            `created: ${areaHighlight.created}\n` +
            `color: ${areaHighlight.color || ''}\n` +
            `type: area-highlight\n`
            ;

        await writer.write(output);

    }

    protected async convertTextHighlight(writer: Writable, textHighlight: TextHighlight, exportable: AnnotationHolder): Promise<void> {

        const output =
            `created: ${textHighlight.created}\n` +
            `color: ${textHighlight.color || ''}\n` +
            `type: text-highlight\n`
            ;

        await writer.write(output);

        const body = Texts.toString(textHighlight.text);

        if (body) {
            await writer.write(body);
        }

    }

    protected async convertComment(writer: Writable, comment: Comment, exportable: AnnotationHolder): Promise<void> {

        const output =
            `created: ${comment.created}\n` +
            `type: comment\n`
        ;

        await writer.write(output);

        const body = Texts.toString(comment.content);

        if (body) {
            await writer.write(body);
        }

    }

    protected async convertFlashcard(writer: Writable, flashcard: Flashcard, exportable: AnnotationHolder): Promise<void> {

        for (const fieldName of Object.keys(flashcard.fields)) {

            const output =
                `created: ${flashcard.created}\n` +
                `type: flashcard\n`
            ;

            await writer.write(output);

            const field = flashcard.fields[fieldName];

            await writer.write(`${fieldName}: ` + Texts.toString(field));

        }

    }

}
