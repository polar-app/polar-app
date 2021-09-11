import {ExpressFunctions} from "../util/ExpressFunctions";
import {SSRServer} from "./SSRServer";

export const SSRFunction = ExpressFunctions.createHook('SSRFunction', async (req, res) => {

    // tslint:disable-next-line:no-string-literal
    if (req.cookies['__session']) {

        // there is a cookie so this needs to just work as normal...

        res.set('Cache-Control', 'private');

        res.send(await SSRServer.readIndexHTML());

    } else {
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        res.send(await SSRServer.render());
    }

});
