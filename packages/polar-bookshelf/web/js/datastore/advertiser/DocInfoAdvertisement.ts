import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

export interface DocInfoAdvertisement {
    readonly docMeta: IDocMeta | undefined;
    readonly docInfo: IDocInfo;
    readonly advertisementType: AdvertisementType;
}

export type AdvertisementType = 'created' | 'updated' | 'deleted';

export type DocInfoAdvertisementListener = (docInfoAdvertisement: DocInfoAdvertisement) => void;
