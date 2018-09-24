import {Logger} from '../../logger/Logger';
import {WebContentsNotifiers} from '../../electron/web_contents_notifier/WebContentsNotifiers';
import {BrowserAppEvents} from './BrowserAppEvents';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {BrowserNavBar} from './react/BrowserNavBar';
import {DocumentReadyStates} from '../../util/dom/DocumentReadyStates';
import {isPresent} from '../../Preconditions';

const log = Logger.create();

export class BrowserApp {

    public async start() {

        await DocumentReadyStates.waitFor(document, 'complete');

        ReactDOM.render(
            <BrowserNavBar onLoadURL={this.onLoadURL}
                           onTriggerCapture={this.onTriggerCapture} />,
            document.getElementById('browser-navbar-parent') as HTMLElement
        );

        //
        // const linkInputElement = <HTMLInputElement> document.querySelector("#link")!;
        //
        // linkInputElement.addEventListener('keypress', (event) => this.onLinkKeyPress(event));
        //
        // const captureButtonElement = <HTMLInputElement> document.querySelector("#capture")!;
        //
        // captureButtonElement.addEventListener('click', () => this.onTriggerCapture());
        //
        // log.info("started");
        //
        const content = document.querySelector("#content")! as Electron.WebviewTag;

        content.addEventListener('dom-ready', async () => {

            content.insertCSS('html,body{ overflow: hidden !important; }');

            content.addEventListener('will-navigate', (event: Electron.WillNavigateEvent) => {
                this.webviewNavigated(event.url);
            });

            content.addEventListener('did-start-loading', () => {
                console.log("started loading");
                document.body.scrollTo(0, 0);
            });

        });


    }
    //
    //
    // private onLinkKeyPress(event: Event) {
    //
    //     if (event instanceof KeyboardEvent && event.which === 13) {
    //
    //         console.log("GOT enter");
    //
    //         const element = <HTMLInputElement> document.querySelector("#link")!;
    //
    //         this.onLinkChange(element.value);
    //
    //     }
    //
    // }
    //
    private onLoadURL(value: string) {

        if (isPresent(value) && ! value.startsWith("http:") && ! value.startsWith("https:")) {
            log.debug("Not a URL: " + value);
            return;
        }

        log.debug("Starting capture on URL: " + value);

        // const webContentsId = this.getWebContentsId();
        // log.info("Working with web contents: " + webContentsId);
        // CaptureClient.startCapture(value, webContentsId);

        WebContentsNotifiers.dispatchEvent(BrowserAppEvents.PROVIDE_URL, value);

    }
    //
    //
    private onTriggerCapture() {

        WebContentsNotifiers.dispatchEvent(BrowserAppEvents.TRIGGER_CAPTURE, {});

    }
    //
    // private getWebContentsId() {
    //
    //     const content = <Electron.WebviewTag> document.querySelector("#content")!;
    //     const webContents = content.getWebContents();
    //     return webContents.id;
    //
    // }
    //

    private webviewNavigated(url: string) {

        const element = document.querySelector("#url-bar input")! as HTMLInputElement;
        element.value = url;

    }

}
