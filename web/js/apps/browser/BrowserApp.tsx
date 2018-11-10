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
import {BackgroundFrameResizer} from '../../viewer/html/BackgroundFrameResizer';

const log = Logger.create();

export class BrowserApp {

    /**
     * Truen when the user has loaded an external URL.
     */
    private loadedURL: boolean = false;

    public async start() {

        await DocumentReadyStates.waitFor(document, 'complete');

        const navigationReactor = new SimpleReactor<NavigationEventType>();

        ReactDOM.render(
            <BrowserNavBar onLoadURL={(url) => this.onLoadURL(url)}
                           onBrowserChanged={(browserName: string) => this.onBrowserChanged(browserName)}
                           onTriggerCapture={() => this.onTriggerCapture()}
                           onReload={() => this.onReload()}
                           navigationReactor={navigationReactor} />,
            document.getElementById('browser-navbar-parent') as HTMLElement
        );

        const content = this.getContentHost();

        content.addEventListener('dom-ready', async () => {

            content.insertCSS('html, body { overflow: hidden !important; }');

            content.addEventListener('will-navigate', (event: Electron.WillNavigateEvent) => {
                this.webviewNavigated(event.url);
            });

            let progressBar: ProgressBar | undefined;

            ['did-start-loading', 'did-stop-loading', 'did-fail-load', 'dom-ready' ]
                .map(eventListenerName => content.addEventListener(eventListenerName, () => this.refreshTitle()));

            // Corresponds to the points in time when the spinner of the tab
            // starts spinning.
            content.addEventListener('did-start-loading', () => {

                if (! this.loadedURL) {
                    return;
                }

                progressBar = ProgressBar.create(true);
                document.body.scrollTo(0, 0);

                this.startResizingWebview();

                navigationReactor.dispatchEvent('did-start-loading');

            });

            // Corresponds to the points in time when the spinner of the tab
            // stops spinning.
            content.addEventListener('did-stop-loading', () => {

                if (! this.loadedURL) {
                    return;
                }

                if (progressBar) {
                    progressBar.destroy();
                }

                navigationReactor.dispatchEvent('did-stop-loading');

            });

            content.addEventListener('did-fail-load', () => {
                log.warn("Load of URL failed.");
            });

            content.addEventListener('console-message', (consoleMessageEvent: Electron.ConsoleMessageEvent) => {

                const prefix = 'From webview: ';

                switch (consoleMessageEvent.level) {

                    case -1:
                        log.debug(prefix + consoleMessageEvent.message);
                        break;

                    case 0:
                        log.info(prefix + consoleMessageEvent.message);
                        break;

                    case 1:
                        log.warn(prefix + consoleMessageEvent.message);
                        break;

                    case 2:
                        log.error(prefix + consoleMessageEvent.message);
                        break;

                }

            });

        });

    }

    private onLoadURL(value: string) {

        if (isPresent(value) && ! value.startsWith("http:") && ! value.startsWith("https:")) {
            log.debug("Not a URL: " + value);
            return;
        }

        log.debug("Loading URL: " + value);

        this.loadedURL = true;
        WebContentsNotifiers.dispatchEvent(BrowserAppEvent.PROVIDE_URL, value);

    }

    private onTriggerCapture() {

        WebContentsNotifiers.dispatchEvent(BrowserAppEvent.TRIGGER_CAPTURE, {});

    }

    private onBrowserChanged(browserName: string) {

        const browser = BrowserRegistry[browserName];

        // TODO: make methods for each events type adn call
        // BrowserAppEvents.configureWindow
        WebContentsNotifiers.dispatchEvent(BrowserAppEvent.CONFIGURE_WINDOW, browser);


    }

    private webviewNavigated(url: string) {

        // FIXME: use a method to get this data..

        const element = document.querySelector("#url-bar")! as HTMLInputElement;
        element.value = url;

    }

    private onReload() {

        const content = this.getContentHost();

        this.onLoadURL(content.getURL());

    }

    private startResizingWebview() {

        const contentHost = this.getContentHost();
        const backgroundFrameResizer
            = new BackgroundFrameResizer(contentHost.parentElement!, contentHost);

        backgroundFrameResizer.start();

    }

    private refreshTitle() {
        const contentHost = this.getContentHost();
        document.title = contentHost.getTitle();
    }

    private getContentHost() {
        return document.querySelector("#content")! as Electron.WebviewTag;
    }

}

export type NavigationEventType = 'did-start-loading' | 'did-stop-loading';

export namespace TriggerBrowserLoad {

    export const MESSAGE_TYPE = 'trigger-browser-load-url';

    export interface Message {
        type: string;
        url: string;
    }

}
