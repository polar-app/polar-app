
export type DocFormat = 'html' | 'pdf' | 'epub';

/**
 *
 */
export class DocFormats {

    /**
     * Get the doc format we're using (html, pdf, epub, etc).
     */
    public static getFormat(): DocFormat | undefined {

        const polarDocFormat = document.querySelector("meta[name='polar-doc-format']");

        if (polarDocFormat) {
            return <DocFormat> polarDocFormat.getAttribute("content") || undefined;
        }

        return undefined;

    }

}
