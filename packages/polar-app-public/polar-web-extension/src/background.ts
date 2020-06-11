import {InitialSplash} from './InitialSplash';
import {ImportContentHandler} from './legacy/ImportContentHandler';
import {BrowserScreenshotHandler} from './BrowserScreenshotHandler';
import {ExtensionInstallHandler} from './ExtensionInstallHandler';

InitialSplash.register();
ImportContentHandler.register();
BrowserScreenshotHandler.register();
ExtensionInstallHandler.register();
