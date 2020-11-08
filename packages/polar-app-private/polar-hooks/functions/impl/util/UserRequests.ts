import {UserRequest} from './UserRequest';
import {IDUsers} from './IDUsers';
import {IDUser} from './IDUsers';
import {ExpressFunctions} from './ExpressFunctions';
import express from 'express';

export class UserRequests {

    public static execute<B, V>(req: express.Request,
                                res: express.Response,
                                handler: (idUser: IDUser,
                                          body: B,
                                          req: express.Request,
                                          res: express.Response) => Promise<V>): void {


        const doHandle = async () => {

            /**
             * Convert a request to a body including factoring in GET requests.
             */
            const toBody = (): any => {

                if (req.method === 'GET') {

                    if (req.params['data']) {
                        return JSON.parse(req.params['data']);
                    }

                } else {
                    return req.body;
                }

            };

            const userRequest: UserRequest<B> = toBody();
            const {body} = userRequest;

            const idUser = await IDUsers.fromIDToken(userRequest.idToken);

            const response = await handler(idUser, body, req, res);

            ExpressFunctions.sendResponse(res, response || {});

        };

        doHandle().catch(err => {
            ExpressFunctions.sendError(res, err);
        });

    }

}
