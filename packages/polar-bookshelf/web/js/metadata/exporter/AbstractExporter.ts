import {Exporter, Writable} from "./Exporters";
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {IComment} from "polar-shared/src/metadata/IComment";
import {AnnotationHolder} from "polar-shared/src/metadata/AnnotationHolder";
import {ReadableBinaryDatastore} from "polar-shared/src/datastore/IDatastore";

export abstract class AbstractExporter implements Exporter {

    public abstract readonly id: string;

    protected writer?: Writable;
    protected datastore?: ReadableBinaryDatastore;

    public async init(writer: Writable, datastore: ReadableBinaryDatastore): Promise<void> {
        this.writer = writer;
        this.datastore = datastore;
    }

    public async write(exportable: AnnotationHolder): Promise<void> {

        switch (exportable.annotationType) {

            case AnnotationType.TEXT_HIGHLIGHT:
                await this.writeTextHighlight(<ITextHighlight> exportable.original, exportable);
                break;

            case AnnotationType.AREA_HIGHLIGHT:
                await this.writeAreaHighlight(<IAreaHighlight> exportable.original, exportable);
                break;

            case AnnotationType.COMMENT:
                await this.writeComment(<IComment> exportable.original, exportable);
                break;

            case AnnotationType.FLASHCARD:
                await this.writeFlashcard(<IFlashcard> exportable.original, exportable);
                break;

        }

    }

    protected abstract writeTextHighlight(textHighlight: ITextHighlight,
                                          exportable: AnnotationHolder): Promise<void>;

    protected abstract writeAreaHighlight(areaHighlight: IAreaHighlight,
                                          exportable: AnnotationHolder): Promise<void>;

    protected abstract writeComment(comment: IComment,
                                    exportable: AnnotationHolder): Promise<void>;

    protected abstract writeFlashcard(flashcard: IFlashcard,
                                      exportable: AnnotationHolder): Promise<void>;

    public async close(err?: Error): Promise<void> {

        // noop

    }

}
