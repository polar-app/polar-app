import basex from 'base-x';

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const encoder = basex(ALPHABET)

export namespace BS58 {

    export function encode(data: Buffer | readonly number[] | Uint8Array ): string {
        return encoder.encode(data);
    }

    export function decode(data: string) {
        return encoder.decode(data);
    }

}
