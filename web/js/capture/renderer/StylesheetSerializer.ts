/**
 * Uses the document parsed CSS styles to serialize to a
 */
import {StringBuffer} from "../../util/StringBuffer";
import {Nullables} from "../../util/ts/Nullables";

export class StylesheetSerializer {

    public static serialize(listener: SerializedStylesheetListener) {

        for (const styleSheet of Array.from(document.styleSheets)) {

            const serializedStylesheet = this.toSerializedStylesheet(<CSSStyleSheet> styleSheet);
            listener(serializedStylesheet);

        }

    }

    private static toSerializedStylesheet(styleSheet: CSSStyleSheet): SerializedStylesheet {

        const buff = new StringBuffer();

        for (const rule of Array.from(styleSheet.rules)) {
            buff.append(rule.cssText)
                .append('\n');

        }


        return {
            disabled: styleSheet.disabled,
            href: Nullables.toUndefined(styleSheet.href),
            text: buff.toString(),
            title: Nullables.toUndefined(styleSheet.title),
            type: styleSheet.type,
        };

    }

}

export type SerializedStylesheetListener = (stylesheet: SerializedStylesheet) => void;

/**
 *
 */
export interface SerializedStylesheet {

    readonly disabled: boolean;

    readonly href?: string;

    /**
     * The serialized text of the CSS.
     */
    readonly text: string;

    readonly title?: string;

    readonly type: string;

}