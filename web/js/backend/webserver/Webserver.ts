import {WebserverConfig} from './WebserverConfig';
import {FileRegistry} from './FileRegistry';
import {Logger} from '../../logger/Logger';
import {Preconditions} from '../../Preconditions';
import {Paths} from '../../util/Paths';

import express, {Express, RequestHandler} from 'express';
import {NextFunction, Request, Response} from 'express';
import serveStatic from 'serve-static';
import {ResourceRegistry} from './ResourceRegistry';
import * as http from "http";
import * as https from "https";
import {PathParams} from 'express-serve-static-core';
import {FilePaths} from '../../util/FilePaths';
import {Rewrite, Rewrites} from "./Rewrites";
import {RewriteURLs} from "./DefaultRewrites";
import {PathToRegexps} from "./PathToRegexps";

const log = Logger.create();

const STATIC_CACHE_MAX_AGE = 365 * 24 * 60 * 60;

/**
 * Start a simple static HTTP server only listening on localhost
 */
export class Webserver implements WebRequestHandler {

    private readonly webserverConfig: WebserverConfig;
    private readonly fileRegistry: FileRegistry;
    private readonly resourceRegistry: ResourceRegistry;

    private app?: Express;
    private server?: http.Server | https.Server;

    constructor(webserverConfig: WebserverConfig,
                fileRegistry: FileRegistry,
                resourceRegistry: ResourceRegistry = new ResourceRegistry()) {

        this.webserverConfig = Preconditions.assertNotNull(webserverConfig, "webserverConfig");
        this.fileRegistry = Preconditions.assertNotNull(fileRegistry, "fileRegistry");
        this.resourceRegistry = resourceRegistry;

    }

    public async start(): Promise<void> {

        log.info("Running with config: ", this.webserverConfig);

        express.static.mime.define({ 'text/html': ['chtml'] });

        this.app = express();

        // handle rewrites FIRST so that we can send URLs to the right destination
        // before all other handlers.
        this.registerRewrites();

        this.app.use((req, res, next) => {

            next();

            if (req.path && req.path.endsWith('woff2')) {
                res.set({ 'Cache-Control': `public, max-age=${STATIC_CACHE_MAX_AGE}, immutable` });
            }

        });

        // TODO: add infinite caching if the files are woff2 web fonts...
        this.app.use(serveStatic(this.webserverConfig.dir, {immutable: true}));

        for (const page of ['login.html', 'index.html']) {

            // handle explicit paths of /login.html and /index.html like we
            // do in the webapp.

            const pagePath =
                FilePaths.join(this.webserverConfig.dir, 'apps', 'repository', page);

            this.app.use(`/${page}`,
                         serveStatic(pagePath, {immutable: true}));

        }

        this.app.use(express.json());
        this.app.use(express.urlencoded());

        const requestLogger = (req: Request, res: Response, next: NextFunction) => {
            console.info(`${req.method} ${req.url}`);
            console.info(req.headers);
            console.info();
            console.info('====');
            next();
        };


        // this.app.use(requestLogger);

        this.registerFilesHandler();
        this.registerResourcesHandler();

        if (this.webserverConfig.useSSL) {

            Preconditions.assertPresent(this.webserverConfig.ssl, "No SSLConfig");

            const sslConfig = {
                key: this.webserverConfig.ssl!.key,
                cert: this.webserverConfig.ssl!.cert
            };

            this.server =
                https.createServer(sslConfig, this.app)
                    .listen(this.webserverConfig.port, this.webserverConfig.host);

        } else {

            this.server =
                http.createServer(this.app)
                    .listen(this.webserverConfig.port, this.webserverConfig.host);

        }

        // await for listening...

        return new Promise<void>(resolve => {
            this.server!.once('listening', () => resolve());
        });

        // log.info(`Webserver up and running on port
        // ${this.webserverConfig.port} with config: `, this.webserverConfig);

    }

    public stop() {

        log.info("Stopping...");
        this.server!.close();
        log.info("Stopping...done");
    }

    public get(type: PathParams, ...handlers: RequestHandler[]): void {
        this.app!.get(type, ...handlers);
    }

    public options(type: PathParams, ...handlers: RequestHandler[]): void {
        this.app!.options(type, ...handlers);
    }

    public post(type: PathParams, ...handlers: RequestHandler[]): void {
        this.app!.post(type, ...handlers);
    }

    public put(type: PathParams, ...handlers: RequestHandler[]): void {
        this.app!.put(type, ...handlers);
    }

    private registerFilesHandler() {

        this.app!.get(/files\/.*/, (req: express.Request, res: express.Response) => {

            try {

                log.info("Handling file at path: " + req.path);

                const hashcode = Paths.basename(req.path);

                if (!hashcode) {
                    const msg = "No key given for /file";
                    log.error(msg);
                    res.status(404).send(msg);
                } else if (!this.fileRegistry.hasKey(hashcode)) {
                    const msg = "File not found with hashcode: " + hashcode;
                    log.error(msg);
                    res.status(404).send(msg);
                } else {

                    const keyMeta = this.fileRegistry.get(hashcode);
                    const filename = keyMeta.filename;

                    log.info(`Serving file at ${req.path} from ${filename}`);

                    return res.sendFile(filename);

                }

            } catch (e) {
                log.error(`Could not handle serving file. (req.path=${req.path})`, e);
            }

        });

    }

    private registerResourcesHandler() {

        this.app!.get(/.*/, (req: express.Request, res: express.Response) => {

            try {

                log.info("Handling resource at path: " + req.path);

                if (!this.resourceRegistry.contains(req.path)) {
                    const msg = "Resource not found: " + req.path;
                    log.error(msg);
                    res.status(404).send(msg);
                } else {

                    const filePath = this.resourceRegistry.get(req.path);
                    return res.sendFile(filePath);

                }

            } catch (e) {
                log.error(`Could not handle serving file. (req.path=${req.path})`, e);
            }

        });

    }

    private registerRewrites() {

        const rewrites = this.webserverConfig.rewrites || [];

        const computeRewrite = (url: string): Rewrite | undefined => {

            for (const rewrite of rewrites) {

                // TODO: it's probably not efficient to build this regex each
                // time
                const regex = PathToRegexps.pathToRegexp(rewrite.source);

                if (Rewrites.matchesRegex(regex, url)) {
                    return rewrite;
                }

            }

            return undefined;

        };

        this.app!.use(function(req, res, next) {

            const rewrite = computeRewrite(req.url);

            if (rewrite) {
                req.url = rewrite.destination;
            }


            next();

        });

    }

}

export interface WebRequestHandler {

    get(type: PathParams, ...handlers: RequestHandler[]): void;
    options(type: PathParams, ...handlers: RequestHandler[]): void;
    post(type: PathParams, ...handlers: RequestHandler[]): void;
    put(type: PathParams, ...handlers: RequestHandler[]): void;

}
