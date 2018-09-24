import {Logger} from '../../logger/Logger';
import {WebContentsNotifiers} from '../../electron/web_contents_notifier/WebContentsNotifiers';
import {BrowserAppEvent} from './BrowserAppEvent';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {BrowserNavBar} from './react/BrowserNavBar';
import {DocumentReadyStates} from '../../util/dom/DocumentReadyStates';
import {isPresent} from '../../Preconditions';
import BrowserRegistry from '../../capture/BrowserRegistry';
import {SimpleReactor} from '../../reactor/SimpleReactor';
import {ProgressBar} from '../../ui/progress_bar/ProgressBar';

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

        const navigationReactor = new SimpleReactor<NavigationEventType>();

        ReactDOM.render(
            <BrowserNavBar onLoadURL={this.onLoadURL}
                           onBrowserChanged={(browserName: string) => this.onBrowserChanged(browserName)}
                           onTriggerCapture={() => this.onTriggerCapture()}
                           onReload={() => this.onReload()}
                           navigationReactor={navigationReactor} />,
            document.getElementById('browser-navbar-parent') as HTMLElement
        );

        const content = document.querySelector("#content")! as Electron.WebviewTag;

        content.addEventListener('dom-ready', async () => {

            content.insertCSS('html, body { overflow: hidden !important; }');

            content.addEventListener('will-navigate', (event: Electron.WillNavigateEvent) => {
                this.webviewNavigated(event.url);
            });

            let progressBar: ProgressBar | undefined;

            // Corresponds to the points in time when the spinner of the tab starts spinning.
            content.addEventListener('did-start-loading', () => {
                console.log("started loading");
                progressBar = ProgressBar.create(true);
                document.body.scrollTo(0, 0);
                navigationReactor.dispatchEvent('did-start-loading');
            });

            // Corresponds to the points in time when the spinner of the tab stops spinning.
            content.addEventListener('did-stop-loading', () => {

                if (progressBar) {
                    progressBar.destroy();
                }

                console.log("finished loading");
                navigationReactor.dispatchEvent('did-stop-loading');
            });

            content.addEventListener('did-fail-load', () => {
                // console.log();
            });

        });


    }

    private onLoadURL(value: string) {

        if (isPresent(value) && ! value.startsWith("http:") && ! value.startsWith("https:")) {
            log.debug("Not a URL: " + value);
            return;
        }

        log.debug("Loading URL: " + value);

        WebContentsNotifiers.dispatchEvent(BrowserAppEvent.PROVIDE_URL, value);

    }

    private onTriggerCapture() {

        WebContentsNotifiers.dispatchEvent(BrowserAppEvent.TRIGGER_CAPTURE, {});

    }

    private onBrowserChanged(browserName: string) {

        const browser = BrowserRegistry[browserName];

        // TODO: make methods for each events type adn call BrowserAppEvents.configureWindow
        WebContentsNotifiers.dispatchEvent(BrowserAppEvent.CONFIGURE_WINDOW, browser);


    }

    private webviewNavigated(url: string) {

        // FIXME: use a method to get this data..

        const element = document.querySelector("#url-bar")! as HTMLInputElement;
        element.value = url;

    }

    private onReload() {

        const content = document.querySelector("#content")! as Electron.WebviewTag;

        this.onLoadURL(content.getURL());

    }
}

export type NavigationEventType = 'did-start-loading' | 'did-stop-loading';

