import {ExpressFunctions} from "../util/ExpressFunctions";
import {SSR} from "./SSR";

export const SSRFunction = ExpressFunctions.createHook('SSRFunction', async (req, res) => {
    const content = SSR.render();
    res.send(content);
});
