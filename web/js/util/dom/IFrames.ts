
export class IFrames {

    public static async waitForContentDocument(iframe: HTMLIFrameElement,
                                        options: WaitForContentDocumentOptions = { currentURL: 'about:blank'}): Promise<HTMLDocument> {

        return new Promise<HTMLDocument>(resolve => {

            function timer() {

                if(iframe.contentDocument && iframe.contentDocument.location.href !== options.currentURL) {
                    resolve(iframe.contentDocument);
                    return;
                }

                setTimeout(timer, 100);
            }

            timer();

        });

    }

}

interface WaitForContentDocumentOptions {
    readonly currentURL: string;
}
