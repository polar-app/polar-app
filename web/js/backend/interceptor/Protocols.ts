import {StreamProtocolCallback} from './StreamInterceptors';
import InterceptStreamProtocolRequest = Electron.InterceptStreamProtocolRequest;

export class Protocols {

    /**
     * Instead of callbacks uses a promise.
     */
    public static async interceptBufferProtocol(protocol: Electron.Protocol,
                                                scheme: string,
                                                handler: any) {

        return new Promise((resolve, reject) => {

            protocol.interceptBufferProtocol(scheme, handler, (error) => {

                if (error) {
                    reject(error);
                }

                resolve();

            });

        });

    }

    /**
     * Instead of callbacks uses a promise.
     */
    public static async interceptStreamProtocol(protocol: Electron.Protocol,
                                                scheme: string,
                                                handler: StreamProtocolHandler) {

        return new Promise((resolve, reject) => {

            protocol.interceptStreamProtocol(scheme, <any> handler, (error: Error) => {

                if (error) {
                    reject(error);
                }

                resolve();

            });

        });

    }


    /**
     * Parse the content-type header and include information about the charset too.
     */
    public static parseContentType(contentType: string | string[]) {

        // https://www.w3schools.com/html/html_charset.asp

        // html4 is ISO-8859-1 and HTML5 is UTF-8

        // https://stackoverflow.com/questions/8499930/how-to-identify-html5

        // text/html; charset=utf-8

        let mimeType = "text/html";

        let value: string;

        if (contentType instanceof Array) {
            // when given as response headers we're given an array of strings
            // since headers can have multiple values but there's no reason
            // contentType should have more than one.
            value = contentType[0];
        } else {
            value = contentType;
        }

        if (! value) {
            value = mimeType;
        }

        let charset;
        let match;

        // noinspection TsLint
        if (match = value.match("^([a-zA-Z]+/[a-zA-Z+]+)")) {
            mimeType = match[1];
        }

        // noinspection TsLint
        if (match = value.match("; charset=([^ ;]+)")) {
            charset = match[1];
        }

        return {
            mimeType,
            charset
        };

    }

}


export interface StreamProtocolHandler {
    (request: InterceptStreamProtocolRequest, callback: StreamProtocolCallback): void;
}
