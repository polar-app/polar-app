import {MarkdownContent} from "./MarkdownContent";
import {NameContent} from "./NameContent";
import {BlockContent} from "../store/BlocksStore";
import {ImageContent} from "./ImageContent";
import {IMarkdownContent} from "polar-blocks/src/blocks/content/IMarkdownContent";
import {INameContent} from "./INameContent";
import {IImageContent} from "./IImageContent";
import {IDateContent} from "./IDateContent";
import {DateContent} from "./DateContent";
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";

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


        }

    }

}
