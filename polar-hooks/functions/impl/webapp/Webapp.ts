import * as functions from 'firebase-functions';
import {Webserver} from "polar-shared-webserver/src/webserver/Webserver";
import {DefaultRewrites} from "polar-backend-shared/src/webserver/DefaultRewrites";
import {MetadataEngines} from "./metadata/MetadataEngines";
import {Rewrite} from 'polar-shared-webserver/src/webserver/Rewrites';
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {StaticIndexGenerator} from "./StaticIndexGenerator";

function createRewrites(): ReadonlyArray<Rewrite> {

    const defaultRewrites = DefaultRewrites.create();
    const metadataEngineHandlerRefs = MetadataEngines.handlers();

    type RewriteMap = {
        [id: string]: Rewrite;
    };

    const idDefaultRewrites: RewriteMap = IDMaps.toIDMap(defaultRewrites.map(current => {
        return {id: current.source, ...current};
    }));

    // now convert the static assets to dynamic so that we can serve custom content for SEO.
    const idMetadataEngineHandlerRefs: RewriteMap = IDMaps.toIDMap(metadataEngineHandlerRefs.map(current => {
        return {
            id: current.source,
            source: current.source,
            destination: (url: string) => StaticIndexGenerator.generate(url)
        };
    }));

    const combined = {...idDefaultRewrites, ...idMetadataEngineHandlerRefs};

    return Object.values(combined);

}

function createWebapp() {
    const rewrites = createRewrites();

    const dir = "/srv/node_modules/polar-webapp-dist/public";
    const app = Webserver.createApp(dir, rewrites);

    console.log("Creating webapp with rewrites: ", rewrites);
    return app;
}

export const Webapp = functions.https.onRequest(createWebapp());
