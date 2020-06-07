import {ElectronGlobalDatastore} from '../../js/datastore/ElectronGlobalDatastore';
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {SpectronWebappMain} from "../../js/test/SpectronWebappMain";
import {Rewrite} from "polar-shared-webserver/src/webserver/Rewrites";

const webRoot = FilePaths.join(__dirname, "..", "..", "..");
const appRoot = webRoot;

const rewrites: ReadonlyArray<Rewrite> = [
    {
        source: "/",
        destination: "content.html"
    },
];

const datastore = ElectronGlobalDatastore.create();

const path = "/web/spectron0/repository-app/content.html";

SpectronWebappMain.run({
    initializer: async () => await datastore.init(),
    webRoot,
    appRoot,
    path,
    rewrites
});
