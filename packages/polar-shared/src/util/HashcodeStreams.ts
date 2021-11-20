import {keccak256} from 'js-sha3';

// TODO: migrate this to use types or build our own API for base58check direclty.
const base58check = require("base58check");

/**
 * Create hashcodes from string data to be used as identifiers in keys.
 */
export namespace HashcodeStreams {

    /**
     * Create a Base58Check encoded KECCAK256 hashcode by using the stream API
     * on a given stream.
     *
     * @param readableStream The stream for which we should create a hashcode.
     */
    export async function createFromStream(readableStream: NodeJS.ReadableStream): Promise<string> {

        const hasher = keccak256.create();

        return new Promise<string>((resolve, reject) => {

            readableStream.on('end', chunk => {
                resolve(base58check.encode(hasher.hex()));
            });

            readableStream.on('error', err => {
                reject(err);
            });

            // data resumes the paused stream so end/error have to be added
            // first.
            readableStream.on('data', chunk => {
                hasher.update(chunk);
            });

        });

    }

}
