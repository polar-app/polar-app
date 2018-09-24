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

        // FIXME: what is left:

        // - change the browser and reload the page when it's selected
        //
        // - ability to reload the page
        //
        // - change the icon when the page is loading

        ReactDOM.render(
            <BrowserNavBar onLoadURL={this.onLoadURL}
                           onTriggerCapture={this.onTriggerCapture} />,
            document.getElementById('browser-navbar-parent') as HTMLElement
        );

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

            content.addEventListener('did-finish-loading', () => {
                console.log("finished loading");
            });

        });


    }

    private onLoadURL(value: string) {

        if (isPresent(value) && ! value.startsWith("http:") && ! value.startsWith("https:")) {
            log.debug("Not a URL: " + value);
            return;
        }

        log.debug("Starting capture on URL: " + value);

        WebContentsNotifiers.dispatchEvent(BrowserAppEvents.PROVIDE_URL, value);

    }

    private onTriggerCapture() {

        WebContentsNotifiers.dispatchEvent(BrowserAppEvents.TRIGGER_CAPTURE, {});

    }

    private webviewNavigated(url: string) {

        const element = document.querySelector("#url-bar input")! as HTMLInputElement;
        element.value = url;

    }

}
