export class WindowEvents {

    public static sendResizeEvent() {

        // TODO: this is deprecated and we should fix it:
        //
        // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/UIEvent

        const resizeEvent = window.document.createEvent('UIEvents');
        (<any> resizeEvent).initUIEvent('resize', true, false, window, 0);
        window.dispatchEvent(resizeEvent);

    }

}
