/**
 * Ad block support.
 */
export class AdBlocker {

    public static cleanse(contentDoc: Document) {

        this.removeElements('amp-ad', contentDoc);

    }

    /**
     * Remove elements matching a simple selector.
     */
    private static removeElements(selector: string, contentDoc: Document): Readonly<IDomMutations> {

        const result = new DomMutations();

        contentDoc.querySelectorAll(selector).forEach((element) => {

            if (element.parentElement) {
                element.parentElement.removeChild(element);
                ++result.elementsRemoved;
            }

        });

        return Object.freeze(result);

    }

}


export interface IDomMutations {
    elementsRemoved: number;
}

export class DomMutations implements IDomMutations {
    public elementsRemoved: number = 0;
}
