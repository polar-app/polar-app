import * as functions from "firebase-functions";
import {ExpressFunctions} from "../util/ExpressFunctions";
import {search} from "polar-search-api/src/api/search/Search";
import {Engines} from "polar-search/src/search/Engines";

export const SearchFunction = functions.https.onRequest(async (req, res) => {

    const request: SearchRequest = req.body;

    // TODO make a caching API so that we can cache unpaywall and other APIs for
    // similar queries.

    const searchEngine = Engines.create(request.target, request);

    const results = await searchEngine.executeQuery();

    ExpressFunctions.sendResponse(res, results)

});

export interface SearchRequest extends search.Request {

    /**
     * The target engine to request.
     */
    readonly target: string;

}
