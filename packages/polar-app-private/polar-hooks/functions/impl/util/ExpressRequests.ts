import express from "express";

export class ExpressRequests {

    public static toFullURL(req: express.Request) {
        return req.protocol + '://' + req.get('host') + req.originalUrl;
    }

}
