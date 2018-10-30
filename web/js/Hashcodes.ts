import {Preconditions} from './Preconditions';
import {keccak256} from 'js-sha3';
import uuid from 'uuid';
import stream from 'stream'

const base58check = require("base58check");

/**
 * Create hashcodes from string data to be used as identifiers in keys.
 *
 * @type {Hashcodes}
 */
export class Hashcodes {

    static create(data: string): string {
        Preconditions.assertNotNull(data, "data");
        //return base58check.encode(createKeccakHash('keccak256').update(data).digest());
        return base58check.encode(keccak256(data));
    }

    /**
     * Create a Base58Check encoded KECCAK256 hashcode by using the stream API
     * on a given stream.
     *
     * @param readableStream
     */
    static async createFromStream(readableStream: NodeJS.ReadableStream): Promise<string> {

        const hasher = keccak256.create();

        return new Promise<string>((resolve, reject) => {

            readableStream.on('data', chunk => {
                hasher.update(chunk);
            });

            readableStream.on('end', chunk => {
                resolve(base58check.encode(hasher.hex()));
            });

            readableStream.on('error', err => {
                reject(err);
            })

        });

    }

    /**
     * Create a hashcode as a truncated SHA hashcode.
     * @param obj {Object} The object to has to form the ID.
     * @param [len] {number} The length of the hash you want to create.
     */
    static createID(obj: any, len = 10) {

        let id = Hashcodes.create(JSON.stringify(obj));

        // truncate.  We don't need that much precision against collision.
        return id.substring(0,len);

    }

    /**
     * Create a random ID which is the the same format as createID() (opaque).
     */
    static createRandomID(len = 10) {
        return this.createID({uuid: uuid.v4()}, len);
    }

}
