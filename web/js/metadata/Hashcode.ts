
export interface Hashcode {
    readonly enc: HashEncoding;
    alg: HashAlgorithm;
    data: string;
}

export enum HashEncoding {
    BASE58CHECK = 'base58check'
}

export enum HashAlgorithm {
    KECCAK256 = 'keccak256'
}


