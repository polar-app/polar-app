
import http, {ClientRequest, IncomingMessage, RequestOptions} from 'http';
import https from 'https';
import {URL} from "url";
import * as url from 'url';

export class Http {

    /**
     * Perform an HTTP test and get the response.
     *
     * https://nodejs.org/api/http.html#http_http_request_options_callback
     *
     *
     * // TODO: replace with: https://github.com/request/request
     *
     * @param options
     */
    static async fetchContent(options: RequestOptions | string): Promise<Buffer> {

        if (typeof options === 'string') {
            options = url.parse(options);
        }

        let provider: Requester;

        if(options.protocol === "http:") {
            console.log("Using http");
            provider = http;
        } else if (options.protocol === "https:") {
            console.log("Using https");
            provider = https;
        } else {
            throw new Error("No provider for protocol: " + options.protocol);
        }

        return new Promise<Buffer>((resolve, reject) => {

            provider.get(options, response => {

                if(response.statusCode !== 200) {
                    reject(new Error("Wrong status code: " + response.statusCode));
                }

                // reject if we don't have the proper response

                let data: any[] = [];

                response.on('data', (chunk) => {
                    data.push(chunk);
                });

                response.on('end', () => {
                    //at this point data is an array of Buffers
                    //so Buffer.concat() can make us a new Buffer
                    //of all of them together
                    let buffer = Buffer.concat(data);
                    resolve(buffer);

                });

            })

        });

    }

    /**
     * Execute an HTTP request and return the data and the response.
     * @param options
     * @return {Promise<any>}
     */
    static async execute(options: RequestOptions | string): Promise<Executed> {

        if (typeof options === 'string') {
            options = url.parse(options);
        }

        let provider: Requester;

        if(options.protocol === "http:") {
            console.log("Using http");
            provider = http;
        } else if (options.protocol === "https:") {
            console.log("Using https");
            provider = https;
        } else {
            throw new Error("No provider for protocol: " + options.protocol);
        }

        return new Promise<Executed>((resolve, reject) => {

            provider.get(options, (response) => {

                if(response.statusCode !== 200) {
                    reject(new Error("Wrong status code: " + response.statusCode));
                }

                // reject if we don't have the proper response

                let data: any[] = [];

                response.on('data', (chunk) => {
                    data.push(chunk);
                });

                response.on('end', () => {
                    //at this point data is an array of Buffers
                    //so Buffer.concat() can make us a new Buffer
                    //of all of them together
                    let buffer = Buffer.concat(data);
                    resolve({
                        response,
                        data: buffer
                    });

                });

            })

        });

    }

}

export interface Requester {
    get(options: RequestOptions | string | URL, callback?: (res: IncomingMessage) => void): ClientRequest;
}

export interface Executed {
    response: http.IncomingMessage,
    data: Buffer
}
