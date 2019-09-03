import {MainDatastore} from '../../js/datastore/MainDatastore';
import {FilePaths} from "../../js/util/FilePaths";
import {SpectronWebappMain} from "../../js/test/SpectronWebappMain";
import {Rewrite} from "../../js/backend/webserver/Rewrites";

const webRoot = FilePaths.join(__dirname, "..", "..", "..");
const appRoot = __dirname;

const rewrites: ReadonlyArray<Rewrite> = [
    {
        source: "/",
        destination: "web/spectron0/repository-app/app.html"
    }
];

MainDatastore.create();

SpectronWebappMain.run({webRoot, appRoot, path: "/", rewrites});
