import {SpectronWebappMain} from '../../js/test/SpectronWebappMain';
import {FilePaths} from '../../js/util/FilePaths';

const webRoot = FilePaths.join(__dirname, "..", "..", "..");
const appRoot = __dirname;

SpectronWebappMain.run(webRoot, appRoot, "/web/spectron/firebase-cloud-aware-datastore/content.html");
