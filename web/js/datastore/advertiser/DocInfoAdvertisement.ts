import {IDocInfo} from '../../metadata/DocInfo';

export interface DocInfoAdvertisement {
    readonly docInfo: IDocInfo;
    readonly advertisementType: AdvertisementType;
}

export type AdvertisementType = 'created' | 'updated' | 'deleted';

export type DocInfoAdvertisementListener = (docInfoAdvertisement: DocInfoAdvertisement) => void;
