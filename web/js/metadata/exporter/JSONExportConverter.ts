import {Writable} from "./Exporter";
import {AnnotationHolder} from "../AnnotationHolder";
import {TextHighlight} from "../TextHighlight";
import {AreaHighlight} from '../AreaHighlight';
import {AbstractExportConverter} from './AbstractExportConverter';
import {Flashcard} from '../Flashcard';
import {Comment} from '../Comment';
import {Texts} from "../Texts";

export class JSONExportConverter extends AbstractExportConverter {

    public readonly id: string = 'json';

    private hasItem: boolean = false;

    public async init(writer: Writable): Promise<void> {
        return super.init(writer);

        await writer.write("{\n");
        await writer.write("  \"version\": 1.0,\n");
        await writer.write("  \"items\": [\n");

    }

    private async onItem(writer: Writable) {

        if (this.hasItem) {
            await writer.write(",\n");
        }

        this.hasItem = true;

    }

    protected async convertAreaHighlight(writer: Writable, areaHighlight: AreaHighlight, exportable: AnnotationHolder): Promise<void> {
        await writer.write(JSON.stringify(areaHighlight, null, "  "));
    }

    protected async convertTextHighlight(writer: Writable, textHighlight: TextHighlight, exportable: AnnotationHolder): Promise<void> {
        await writer.write(JSON.stringify(textHighlight, null, "  "));
    }

    protected async convertComment(writer: Writable, comment: Comment, exportable: AnnotationHolder): Promise<void> {
        await writer.write(JSON.stringify(comment, null, "  "));
    }

    protected async convertFlashcard(writer: Writable, flashcard: Flashcard, exportable: AnnotationHolder): Promise<void> {
        await writer.write(JSON.stringify(Flashcard, null, "  "));
    }

    public async close(writer: Writable, err?: Error): Promise<void> {

        await writer.write("\n  ]\n");
        await writer.write("\n}\n");

        return super.close(writer, err);
    }
}
