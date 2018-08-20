import {CaptureOpts} from './CaptureOpts';
import {WebRequest, WebContents, BrowserWindow} from 'electron';
import {CaptureResult} from './CaptureResult';
import {Logger} from '../logger/Logger';
import {notNull, Preconditions} from '../Preconditions';
import {PendingWebRequestsListener} from '../webrequests/PendingWebRequestsListener';
import {DebugWebRequestsListener} from '../webrequests/DebugWebRequestsListener';
import {WebRequestReactor} from '../webrequests/WebRequestReactor';
import {WebContentsDriver, WebContentsDriverFactory} from './drivers/WebContentsDriver';
import {BrowserProfile} from './BrowserProfile';
import {Strings} from '../util/Strings';
import {Optional} from '../util/ts/Optional';

const {Filenames} = require("../util/Filenames");
const {Files} = require("../util/Files");
const {Functions} = require("../util/Functions");
const {CapturedPHZWriter} = require("./CapturedPHZWriter");
const {DefaultPagingBrowser} = require("../electron/capture/pagination/DefaultPagingBrowser");
const {PagingLoader} = require("../electron/capture/pagination/PagingLoader");

const log = Logger.create();

const USE_PAGING_LOADER = false;

/**
 * This is a hard coded delay to hold off capturing the content until the page
 * has finished executing all onLoad handlers. I need our own way to handle this
 * within the capture main process. Maybe I could add our own loader to the END
 * of the list and only run once our loader function finishes last.
 *
 * @type {number}
 */
const EXECUTE_CAPTURE_DELAY = 1500;

export class Capture2 {

    public url: string;
    public readonly browserProfile: BrowserProfile;
    public readonly stashDir: string;
    public readonly captureOpts: CaptureOpts;

    public readonly pendingWebRequestsListener: PendingWebRequestsListener;
    public readonly debugWebRequestsListener: DebugWebRequestsListener;

    public readonly webRequestReactors: WebRequestReactor[] = [];

    /**
     * The resolve function to call when we have completed .
     */
    public resolve: CaptureResultCallback = () => {};

    private webContents?: WebContents;

    private driver?: WebContentsDriver;

    /**
     *
     */
    constructor(url: string, browserProfile: BrowserProfile, stashDir: string, captureOpts: CaptureOpts = {amp: true}) {

        // FIXME: don't allow named anchors in the URL like #foo... strip them
        // and test this functionality.

        this.url = Preconditions.assertNotNull(url, "url");

        if(Strings.empty(this.url)) {
            throw new Error("URL may not be empty")
        }

        this.browserProfile = Preconditions.assertNotNull(browserProfile, "browser");
        this.stashDir = Preconditions.assertNotNull(stashDir, "stashDir");
        this.captureOpts = captureOpts;

        this.pendingWebRequestsListener = new PendingWebRequestsListener();
        this.debugWebRequestsListener = new DebugWebRequestsListener();

        if(captureOpts.pendingWebRequestsCallback) {
            this.pendingWebRequestsListener.addEventListener(captureOpts.pendingWebRequestsCallback);
        }

    }

    // async test() {
    //
    //     console.log("FIXME")
    //
    //     let window = new BrowserWindow({show: false});
    //
    //     window.loadURL('about:blank');
    //
    //     window.on('ready-to-show', () => {
    //         log.info("FIXME ready to show");
    //     });
    //
    // }

    async start() {

        // await this.test();

        let driver = await WebContentsDriverFactory.create(this.browserProfile);

        this.driver = driver;

        this.webContents = await driver.getWebContents();

        this.webContents.once('did-finish-load', async () => {

            // FIXME this amp stuff is probably broken

            log.info("did-finish-load: ", arguments);

            // see if we first need to handle the page in any special manner.

            let ampURL = await this.getAmpURL();

            // TODO: if we end up handling multiple types of URLs in the future
            // we might want to build up a history to prevent endless loops or
            // just keep track of the redirect count.
            if(this.captureOpts.amp && ampURL && ampURL !== this.url) {

                log.info("Found AMP URL.  Redirecting then loading: " + ampURL);

                // redirect us to the amp URL as this will render better.
                this.loadURL(ampURL);
                return;

            }

            setTimeout(() => {

                // capture within timeout just for debug purposes.

                this.startCapture()
                    .catch(err => log.error(err));

            }, 1);

        });

        this.onWebRequest(this.webContents.session.webRequest);


        log.info("Telling WebContents to load: ", this.url);
        //
        this.webContents.loadURL(this.url);

        return new Promise(resolve => {
            this.resolve = resolve;
        });

    }

    loadURL(url: string) {

        // change the global URL we're loading...
        this.url = url;

        const loadURLOptions = {

            // TODO: I don't think we should use no-cache or at least make it
            // a command line option. Probably best to not use it by default
            // but then make it an option later.

            extraHeaders: `pragma: no-cache\nreferer: ${url}\n`,
            userAgent: this.browserProfile.userAgent

        };

        this.webContents!.loadURL(url, loadURLOptions);

    }

    /**
     * Called when the onLoad handler is executed and we're ready to start the
     * capture.
     */
    async startCapture() {

        if(USE_PAGING_LOADER) {

            let pagingBrowser = new DefaultPagingBrowser(this.webContents);

            let pagingLoader = new PagingLoader(pagingBrowser, async () => {
                log.info("Paging loader finished.")
            } );

            // WARN: this was removed as part of the TS migration and would need
            // to be enabled if we want this to work again.
            //
            //this.pendingWebRequestsListener.addEventListener(pendingRequestEvent => {
            //    pagingLoader.onPendingRequestsUpdate(pendingRequestEvent);
            //});

            await pagingLoader.onLoad();

        }

        this.webRequestReactors.forEach(webRequestReactor => {
            log.info("Stopping webRequestReactor...");
            webRequestReactor.stop();
            log.info("Stopping webRequestReactor...done");
        });

        await Functions.waitFor(EXECUTE_CAPTURE_DELAY);

        this.executeContentCapture()
            .catch(err => log.error(err));

    }

    /**
     * See if the page has a rel=amphtml URL.
     *
     * @return {Promise<string>}
     */
    private async getAmpURL() {

        /** @RendererContext */
        function fetchAmpURL() {

            let link = <HTMLLinkElement>document.querySelector("link[rel='amphtml']");

            if(link) {
                return link.href;
            }

            return null;

        }

        return await this.webContents!.executeJavaScript(Functions.functionToScript(fetchAmpURL));

    }

    async executeContentCapture() {

        // TODO: this function should be cleaned up a bit.. it has too many moving
        // parts now and should be moved into smaller functions.

        let webContents = this.webContents!;

        log.info("Capturing the HTML...");

        // define the content capture script.
        //log.info("Defining ContentCapture...");
        //console.log(ContentCapture.toString());
        //log.info("Defining ContentCapture...done");

        log.info("Retrieving HTML...");

        let captured;

        // TODO: I don't think executeJavascript actually handles exceptions
        // properly and they also suggest using the callback so we should test
        // this more aggressively.
        try {

            captured = await webContents.executeJavaScript("ContentCapture.captureHTML()");

        } catch (e) {

            // TODO: this isn't actually called because executeJavascript doesn't
            // handle exceptions. You just block there forever. I need to wrap
            // this with a closure that is an 'either' err or content.

            log.error("Could not capture HTML: ", e);

        }

        log.info("Retrieving HTML...done");

        // record the browser that was used to render this page.
        captured.browser = this.browserProfile;

        let stashDir = this.stashDir;
        let filename = Filenames.sanitize(captured.title);

        // TODO convert the captured JSON to a phz file...

        let phzPath = `${stashDir}/${filename}.phz`;

        log.info("Writing PHZ to: " + phzPath);

        let capturedPHZWriter = new CapturedPHZWriter(phzPath);
        await capturedPHZWriter.convert(captured);

        // write the captured HTML to /tmp for debug purposes.  We can enable this
        // as a command line switch later.

        await Files.writeFileAsync(`/tmp/${filename}.json`, JSON.stringify(captured, null, "  "));

        log.info("Capturing the HTML...done");

        Optional.of(this.driver).when(driver => driver.destroy());

        this.resolve(new CaptureResult({
            path: phzPath
        }));

    }

    /**
     * Called when we have a web request to listen to. Either the first one
     * or subsequent ones from iframes.
     *
     * @param webRequest
     */
    onWebRequest(webRequest: WebRequest) {

        let webRequestReactor = new WebRequestReactor(webRequest);
        webRequestReactor.start();

        this.webRequestReactors.push(webRequestReactor);

        //this.debugWebRequestsListener.register(webRequestReactor);
        this.pendingWebRequestsListener.register(webRequestReactor);

    }

}

export interface CaptureResultCallback {
    (captureResult: CaptureResult): void;
}
