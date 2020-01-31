
/**
 *
 */
export class DocFormats {

    /**
     * Get the doc format we're using (html, pdf, etc). Otherwise return null.
     * @return {*}
     */
    static getFormat(): string | null {

        let polarDocFormat = document.querySelector("meta[name='polar-doc-format']");

        if(polarDocFormat) {
            return polarDocFormat.getAttribute("content");
        }

        return null;

    }

}
