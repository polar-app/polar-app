import {SpectronWebappMain} from '../../js/test/SpectronWebappMain';
import {FilePaths} from '../../js/util/FilePaths';
import {FirebaseTesting} from "../../js/firebase/FirebaseTesting";

FirebaseTesting.validateUsers();

const webRoot = FilePaths.join(__dirname, "..", "..", "..");
const appRoot = __dirname;

SpectronWebappMain.run(webRoot, appRoot, "/web/spectron1/firebase-groups/content.html");
