import {MarkdownContent} from "./MarkdownContent";
import {NameContent} from "./NameContent";
import {BlockContent} from "../store/BlocksStore";
import {ImageContent} from "./ImageContent";
import {IMarkdownContent} from "polar-blocks/src/blocks/content/IMarkdownContent";
import {DateContent} from "./DateContent";
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {INameContent} from "polar-blocks/src/blocks/content/INameContent";
import {IImageContent} from "polar-blocks/src/blocks/content/IImageContent";
import {IDateContent} from "polar-blocks/src/blocks/content/IDateContent";
import {IDocumentContent} from "polar-blocks/src/blocks/content/IDocumentContent";
import {DocumentContent} from "./DocumentContent";
import {
    AnnotationContentType,
    IAreaHighlightAnnotationContent,
    IFlashcardAnnotationContent,
    ITextHighlightAnnotationContent
} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {
    AreaHighlightAnnotationContent,
    FlashcardAnnotationContent,
    TextHighlightAnnotationContent
} from "./AnnotationContent";

export namespace Contents {

    export function create<C extends BlockContent = BlockContent>(opts: C | IBlockContent): C {

        switch (opts.type) {
            case "markdown":
                return new MarkdownContent(opts as IMarkdownContent) as C;
            case "name":
                return new NameContent(opts as INameContent) as C;
            case "image":
                return new ImageContent(opts as IImageContent) as C;
            case "date":
                return new DateContent(opts as IDateContent) as C;

            case "document":
                return new DocumentContent(opts as IDocumentContent) as C;

            case AnnotationContentType.AREA_HIGHLIGHT:
                return new AreaHighlightAnnotationContent(opts as IAreaHighlightAnnotationContent) as C;
            case AnnotationContentType.TEXT_HIGHLIGHT:
                return new TextHighlightAnnotationContent(opts as ITextHighlightAnnotationContent) as C;
            case AnnotationContentType.FLASHCARD:
                return new FlashcardAnnotationContent(opts as IFlashcardAnnotationContent) as C;
        }

    }

}
