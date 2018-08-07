/**
 * A rect and element pair.
 */
class RectElement {

    public readonly rect: any;

    public readonly element: HTMLElement;

    constructor(rect: any, element: HTMLElement) {
        this.rect = rect;
        this.element = element;
    }

}
