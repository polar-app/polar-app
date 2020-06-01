export class Events {
    /**
     * Get the anchor for an element. An event target might be nested in an
     * anchor.
     */
    public static getAnchor(target: EventTarget | null | undefined): HTMLAnchorElement | undefined {

        if(target === null || target === undefined) {
            return undefined;
        }


        let element = <HTMLElement>target;

        if(element.tagName === "A") {
            return <HTMLAnchorElement>element;
        }

        return this.getAnchor(element.parentElement);

    }

}
