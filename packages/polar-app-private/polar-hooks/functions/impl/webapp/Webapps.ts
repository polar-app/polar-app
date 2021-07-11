import {Express} from "express";
import {Webserver} from "polar-shared-webserver/src/webserver/Webserver";
import {DefaultRewrites} from "polar-backend-shared/src/webserver/DefaultRewrites";
import {
    DestinationRewrite,
    DirectRewrite,
    Rewrites
} from 'polar-shared-webserver/src/webserver/Rewrites';
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {URLPathStr} from "polar-shared/src/url/PathToRegexps";
import {Reducers} from "polar-shared/src/util/Reducers";
import {ExpressFunctions} from "../util/ExpressFunctions";

export class Webapps {

    public static createRewrites(): ReadonlyArray<DirectRewrite> {

        const defaultRewrites = DefaultRewrites.create();

        function toDirectRewrites(rewrite: DestinationRewrite): ReadonlyArray<DirectRewrite> {

            function toDirectRewrite(source: URLPathStr, rewrite: DestinationRewrite): DirectRewrite {
                return {
                    id: source,
                    source,
                    destination: rewrite.destination,
                };
            }

            const sources = Rewrites.toSources(rewrite);
            return sources.map(source => toDirectRewrite(source, rewrite));

        }

        const directRewritesBySource: ReadonlyArray<ReadonlyArray<DirectRewrite>>
            = defaultRewrites.map(current => toDirectRewrites(current));

        const directRewrites = directRewritesBySource.reduce(Reducers.FLAT);

        const idDefaultRewrites = IDMaps.create(directRewrites);

        return Object.values(idDefaultRewrites);

    }

    public static createWebapp(app: Express = ExpressFunctions.createApp()) {
        const rewrites = this.createRewrites();

        const dir = "/srv/node_modules/polar-webapp-dist/public";
        app = Webserver.createApp(dir, rewrites, app);

        console.log("Creating webapp with rewrites: ", rewrites);
        return app;
    }

}
