import {Writable} from "./Exporters";
import {AbstractExporter} from './AbstractExporter';
import {Strings} from "polar-shared/src/util/Strings";
import {IComment} from "polar-shared/src/metadata/IComment";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {AnnotationHolder} from "polar-shared/src/metadata/AnnotationHolder";
import {ReadableBinaryDatastore} from "polar-shared/src/datastore/IDatastore";

export class JSONExporter extends AbstractExporter {

    public readonly id: string = 'json';

    private hasItem: boolean = false;

    public async init(writer: Writable, datastore: ReadableBinaryDatastore): Promise<void> {
        await super.init(writer, datastore);

        await writer.write("{\n");
        await writer.write("  \"version\": 1,\n");
        await writer.write("  \"items\": [\n");

    }

    private async onItem() {

        if (this.hasItem) {
            await this.writer!.write(",\n");
        }

        this.hasItem = true;

    }

    protected async writeAreaHighlight(areaHighlight: IAreaHighlight, exportable: AnnotationHolder): Promise<void> {
        await this.onItem();
        await this.writer!.write(this.toRecord(areaHighlight));
    }

    protected async writeTextHighlight(textHighlight: ITextHighlight, exportable: AnnotationHolder): Promise<void> {
        await this.onItem();
        await this.writer!.write(this.toRecord(textHighlight));
    }

    protected async writeComment(comment: IComment, exportable: AnnotationHolder): Promise<void> {
        await this.onItem();
        await this.writer!.write(this.toRecord(comment));
    }

    protected async writeFlashcard(flashcard: IFlashcard, exportable: AnnotationHolder): Promise<void> {
        await this.onItem();
        await this.writer!.write(this.toRecord(flashcard));
    }

    public async close(err?: Error): Promise<void> {

        await this.writer!.write("\n  ]\n");
        await this.writer!.write("\n}\n");

        return super.close(err);
    }

    private toRecord(obj: any) {
        return Strings.indent(JSON.stringify(obj, null, "  "), "    ");
    }

}
