import {SpectronWebappMain} from "../../js/test/SpectronWebappMain";
import {ElectronGlobalDatastore} from "../../js/datastore/ElectronGlobalDatastore";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {Rewrite} from "polar-shared-webserver/src/webserver/Rewrites";

const webRoot = __dirname;
const appRoot = FilePaths.join(__dirname, "..", "..", "..");

const rewrites: ReadonlyArray<Rewrite> = [
    {
        source: "/",
        destination: "content.html"
    },
];

const datastore = ElectronGlobalDatastore.create();

const path = "/content.html";

SpectronWebappMain.run({
    initializer: async () => await datastore.init(),
    webRoot,
    appRoot,
    path,
    rewrites
});
