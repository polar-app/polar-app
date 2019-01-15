import {Writable} from "./Exporter";
import {AnnotationHolder} from "../AnnotationHolder";
import {TextHighlight} from "../TextHighlight";
import {AreaHighlight} from '../AreaHighlight';
import {AbstractExportConverter} from './AbstractExportConverter';
import {Flashcard} from '../Flashcard';
import {Comment} from '../Comment';
import {Optional} from "../../util/ts/Optional";
import {Texts} from "../Texts";

export class MarkdownExportConverter extends AbstractExportConverter {

    public readonly id: string = 'markdown';

    protected async convertAreaHighlight(writer: Writable, areaHighlight: AreaHighlight, exportable: AnnotationHolder): Promise<void> {
        // noop

        const output =
            `created: ${areaHighlight.created}` +
            `color: ${areaHighlight.color || ''}`
            ;

        await writer.write(output);

    }

    protected async convertTextHighlight(writer: Writable, textHighlight: TextHighlight, exportable: AnnotationHolder): Promise<void> {

        const output =
            `created: ${textHighlight.created}\n` +
            `color: ${textHighlight.color || ''}\n`
            ;

        await writer.write(output);

        const body = Texts.toString(textHighlight.text);

        if (body) {
            await writer.write(body);
        }

    }

    protected async convertComment(writer: Writable, comment: Comment, exportable: AnnotationHolder): Promise<void> {




    }

    protected async convertFlashcard(writer: Writable, flashcard: Flashcard, exportable: AnnotationHolder): Promise<void> {
        // noop
    }


}
