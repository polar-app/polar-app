import {ExpressFunctions} from "../util/ExpressFunctions";

interface Response {
    readonly code: string,
    readonly success: boolean,
}

interface Request {
}

// @TODO finish this function to handle cancellations, plan changes, etc
export const AppstoreServerNotification = ExpressFunctions.createHookAsync('AppstoreServerNotification', async (req, res) => {

    const request: Request = req.body;

    console.log("Handling request: ", typeof request, request);

    const response: Response = {
        code: 'ok',
        success: true,
    };

    ExpressFunctions.sendResponse(res, response);

});
