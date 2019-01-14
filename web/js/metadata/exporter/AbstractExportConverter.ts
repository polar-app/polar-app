import {ExportConverter, Writable} from "./Exporter";
import {AnnotationHolder} from "../AnnotationHolder";
import {TextHighlight} from "../TextHighlight";
import {AreaHighlight} from '../AreaHighlight';
import {Comment} from '../Comment';
import {Flashcard} from '../Flashcard';
import {AnnotationType} from '../AnnotationType';

export abstract class AbstractExportConverter implements ExportConverter {

    public abstract readonly id: string;

    public async init(writer: Writable): Promise<void> {

        // noop

    }

    public async convert(writer: Writable, exportable: AnnotationHolder): Promise<void> {

        switch (exportable.type) {

            case AnnotationType.TEXT_HIGHLIGHT:
                this.convertTextHighlight(writer, <TextHighlight> exportable.annotation, exportable);
                break;


            case AnnotationType.AREA_HIGHLIGHT:
                this.convertAreaHighlight(writer, <AreaHighlight> exportable.annotation, exportable);
                break;

            case AnnotationType.COMMENT:
                this.convertComment(writer, <Comment> exportable.annotation, exportable);
                break;

            case AnnotationType.FLASHCARD:
                this.convertFlashcard(writer, <Flashcard> exportable.annotation, exportable);
                break;

        }

    }

    protected abstract convertTextHighlight(writer: Writable,
                                            textHighlight: TextHighlight,
                                            exportable: AnnotationHolder): Promise<void>;

    protected abstract convertAreaHighlight(writer: Writable,
                                            areaHighlight: AreaHighlight,
                                            exportable: AnnotationHolder): Promise<void>;

    protected abstract convertComment(writer: Writable,
                                      comment: Comment,
                                      exportable: AnnotationHolder): Promise<void>;

    protected abstract convertFlashcard(writer: Writable,
                                        flashcard: Flashcard,
                                        exportable: AnnotationHolder): Promise<void>;

    public async close(writer: Writable, err?: Error): Promise<void> {

        // noop

    }

}
