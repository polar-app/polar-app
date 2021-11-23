import {keccak256} from 'js-sha3';
import {InputSource} from './input/InputSource';
import {InputData, InputSources} from './input/InputSources';
import {Preconditions} from '../Preconditions';
import {HashAlgorithm, Hashcode, HashEncoding} from "../metadata/Hashcode";
import {BS58} from "./BS58";
import * as nodeCrypto from 'crypto'

// TODO: migrate this to use types or build our own API for base58check directly.
const base58check = require("base58check");

/**
 * Create hashcodes from string data to be used as identifiers in keys.
 */
export namespace Hashcodes {

    export function create(data: any): string {
        Preconditions.assertPresent(data, "data");

        function toRawData(): string | ArrayBuffer | Uint8Array {

            if (typeof data === 'string') {
                return data;
            }

            if (data instanceof ArrayBuffer) {
                return data;
            }

            if (data instanceof Uint8Array) {
                return data;
            }

            if (typeof data === 'object') {
                // we were given an object and convert it to JSON first.
                return JSON.stringify(data);
            }

            return data;

        }

        const rawData = toRawData();

        return base58check.encode(keccak256(rawData));
    }

    export function createHashcode(data: any): Hashcode {

        return {
            enc: HashEncoding.BASE58CHECK,
            alg: HashAlgorithm.KECCAK256,
            data: create(data)
        }
    }

    export async function createFromInputSource(inputSource: InputSource): Promise<string> {

        const hasher = keccak256.create();

        return new Promise<string>((resolve, reject) => {

            InputSources.open(inputSource, (data: InputData | undefined, err: Error | undefined) => {

                if (err) {
                    reject(err);
                }

                if (data) {
                    hasher.update(data);
                } else {
                    resolve(base58check.encode(hasher.hex()));
                }

            });

        });

    }

    /**
     * Create a hashcode as a truncated SHA hashcode.
     * @param obj {Object} The object to has to form the ID.
     * @param [len] The length of the hash you want to create.
     */
    export function createID(obj: any, len: number = 10): string {

        const id = create(JSON.stringify(obj));

        // truncate.  We don't need that much precision against collision.
        return id.substring(0, len);

    }

    export interface CreateRandomIDOpts {
        readonly seed?: string | number[];

        /**
         * The length of the ID to generate. If you want the full hashcode
         * specify Infinity.
         */
        readonly len?: number;
    }

    /**
     * Create a random ID which is the the same format as createID() (opaque).
     *
     * The, when given, should be always a constant so that the hashcode output
     * is namespaced.
     */
    export function createRandomID(opts: CreateRandomIDOpts = {}) {

        const {seed} = opts;

        function getRandomValues(): Uint8Array {

            if (typeof window!== 'undefined' && typeof crypto !== 'undefined') {

                // crypto is only found in the browser and not in NodeJS and is
                // a global object so we don't need to import anything

                const rand = new Uint8Array(32);

                // NOTE: I verified this is the PRNG version:
                //
                // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
                //
                // "To guarantee enough performance, implementations are not
                // using a truly random number generator, but they are using a
                // pseudo-random number generator seeded with a value with
                // enough entropy. The pseudo-random number generator algorithm
                // (PRNG) may vary across user agents, but is suitable for
                // cryptographic purposes. Implementations are required to use a
                // seed with enough entropy, like a system-level entropy
                // source."

                crypto.getRandomValues(rand);
                return rand;

            } else {

                // NOTE: I verified this is the PRNG version:
                //
                // https://nodejs.org/api/crypto.html#cryptorandombytessize-callback
                //
                // "Generates cryptographically strong pseudorandom data. The
                // size argument is a number indicating the number of bytes to
                // generate."

                return nodeCrypto.randomBytes(32);

            }

        }

        // provide more randomness to the secure ID generation.

        const now = Date.now();

        const hasher = keccak256.create();

        if (seed !== undefined) {
            hasher.update(seed);
        }

        const rand = getRandomValues();

        hasher.update([now]);
        hasher.update(rand);

        const id = BS58.encode(hasher.array());

        if (opts.len !== Infinity) {
            return id.substring(0, opts.len || 10);
        }

        return id;

    }

}
