import {ExpressFunctions} from "../util/ExpressFunctions";

interface Response {
    code: string,
    success: boolean,
}

interface Request {
}

// @TODO finish this function to handle cancellations, plan changes, etc
export const AppstoreServerNotification = ExpressFunctions.createHook('AppstoreServerNotification', (req, res) => {

    const request: Request = req.body;

    console.log("Handling request: ", typeof request, request);

    const response: Response = {
        code: 'ok',
        success: true,
    };

    ExpressFunctions.sendResponse(res, response);

});
