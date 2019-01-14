import {Writable} from "./Exporter";
import {AnnotationHolder} from "../AnnotationHolder";
import {TextHighlight} from "../TextHighlight";
import {AreaHighlight} from '../AreaHighlight';
import {AbstractExportConverter} from './AbstractExportConverter';
import {Flashcard} from '../Flashcard';
import {Comment} from '../Comment';

export class MarkdownExportConverter extends AbstractExportConverter {

    public readonly id: string = 'markdown';

    protected async convertAreaHighlight(writer: Writable, areaHighlight: AreaHighlight, exportable: AnnotationHolder): Promise<void> {
        // noop
    }

    protected async convertComment(writer: Writable, comment: Comment, exportable: AnnotationHolder): Promise<void> {
        // noop
    }

    protected async convertFlashcard(writer: Writable, flashcard: Flashcard, exportable: AnnotationHolder): Promise<void> {
        // noop
    }

    protected async convertTextHighlight(writer: Writable, textHighlight: TextHighlight, exportable: AnnotationHolder): Promise<void> {
        // noop
    }

}
