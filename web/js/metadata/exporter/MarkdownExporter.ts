import {Writable} from "./Exporters";
import {AnnotationHolder} from "../AnnotationHolder";
import {TextHighlight} from "../TextHighlight";
import {AreaHighlight} from '../AreaHighlight';
import {AbstractExporter} from './AbstractExporter';
import {Flashcard} from '../Flashcard';
import {Comment} from '../Comment';
import {Texts} from "../Texts";
import {PageInfo} from '../PageInfo';
import {Optional} from "polar-shared/src/util/ts/Optional";
import {IPageInfo} from "polar-shared/src/metadata/IPageInfo";

export class MarkdownExporter extends AbstractExporter {

    public readonly id: string = 'markdown';

    protected async writeAreaHighlight(areaHighlight: AreaHighlight, exportable: AnnotationHolder): Promise<void> {
        // noop

        const output =
            `created: ${areaHighlight.created}\n` +
            `color: ${areaHighlight.color || ''}\n` +
            `type: area-highlight\n`
            ;

        await this.writer!.write(output);

    }

    protected pageInfoToText(pageInfo?: IPageInfo): string {

        if (!pageInfo) {
            return "";
        }

        return `page: ${pageInfo.num}\n`;
    }

    protected async writeTextHighlight(textHighlight: TextHighlight, exportable: AnnotationHolder): Promise<void> {

        await this.writer!.write(this.pageInfoToText(exportable.pageInfo));

        const output =
            `created: ${textHighlight.created}\n` +
            `color: ${textHighlight.color || ''}\n` +
            `type: text-highlight\n`
            ;

        await this.writer!.write(output);

        const body = Texts.toString(textHighlight.text);

        if (body) {
            await this.writer!.write(body);
            await this.writer!.write('\n');
        }

    }

    protected async writeComment(comment: Comment, exportable: AnnotationHolder): Promise<void> {

        await this.writer!.write(this.pageInfoToText(exportable.pageInfo));

        const output =
            `created: ${comment.created}\n` +
            `type: comment\n`
        ;

        await this.writer!.write(output);

        const body = Texts.toString(comment.content);

        if (body) {
            await this.writer!.write(body);
            await this.writer!.write('\n');
        }

    }

    protected async writeFlashcard(flashcard: Flashcard, exportable: AnnotationHolder): Promise<void> {

        await this.writer!.write(this.pageInfoToText(exportable.pageInfo));

        for (const fieldName of Object.keys(flashcard.fields)) {

            const output =
                `created: ${flashcard.created}\n` +
                `type: flashcard\n`
            ;

            await this.writer!.write(output);

            const field = flashcard.fields[fieldName];

            await this.writer!.write(`${fieldName}: ` + Texts.toString(field));
            await this.writer!.write('\n');

        }

    }

}
