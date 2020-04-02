export class BoxOptions {


    /**
     * The element or selector to define boxes.
     */
    public target: HTMLElement;

    /**
     * The element used to define the restrictionRect.
     *
     */
    public restrictionElement: HTMLElement;

    /**
     * Specify the CSS selector for intersected elements.
     */
    public intersectedElementsSelector: any;

    constructor(opts: any) {
        this.target = opts.target;
        this.restrictionElement = opts.restrictionElement;
        this.intersectedElementsSelector = opts.intersectedElementsSelector;
    }

}
