import {DocInfo} from '../../metadata/DocInfo';

export interface IDocInfoAdvertisement {
    readonly docInfo: DocInfo;
    readonly advertisementType: AdvertisementType;
}

export enum AdvertisementType {

    CREATED = 'created',

    UPDATED = 'updated',

    DELETED = 'deleted',

}
