/**
 * Uses the document parsed CSS styles to serialize to a
 */
import {StringBuffer} from "../../util/StringBuffer";
import {Nullables} from "../../util/ts/Nullables";

export class StylesheetSerializer {

    public static serialize(listener: SerializedStylesheetListener, doc: Document) {

        this.serializeStylesheets(doc.styleSheets, listener);

    }

    public static serializeStylesheets(styleSheets: StyleSheetList | ReadonlyArray<CSSStyleSheet>,
                                       listener: SerializedStylesheetListener) {

        for (const styleSheet of Array.from(styleSheets)) {

            const serializedStylesheetRef = this.toSerializedStylesheet(<CSSStyleSheet> styleSheet);
            listener(serializedStylesheetRef.stylesheet);

            this.serializeStylesheets(serializedStylesheetRef.imports, listener);

        }

    }

    private static toSerializedStylesheet(styleSheet: CSSStyleSheet): SerializedStylesheetRef {

        const buff = new StringBuffer();

        const imports: CSSStyleSheet[] = [];

        for (const rule of Array.from(styleSheet.rules)) {

            buff.append(rule.cssText)
                .append('\n');

            if (rule instanceof CSSImportRule) {

                // The type of this will be CSSImportRule if this is an @import
                // and a CSSImportRule also has a styleSheet which needs to be recursively
                // handled.

                // include this in the result so we can traverse it too.
                imports.push(rule.styleSheet);

            }

        }

        const stylesheet: SerializedStylesheet = {
            disabled: styleSheet.disabled,
            href: Nullables.toUndefined(styleSheet.href),
            text: buff.toString(),
            title: Nullables.toUndefined(styleSheet.title),
            type: styleSheet.type,
        };

        return {imports, stylesheet};

    }

}

export type SerializedStylesheetListener = (stylesheet: SerializedStylesheet) => void;

export interface SerializedStylesheetRef {

    readonly imports: ReadonlyArray<CSSStyleSheet>;

    readonly stylesheet: SerializedStylesheet;

}

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

