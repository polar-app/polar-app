import {DocMeta, IDocMeta} from '../../metadata/DocMeta';

export interface DocMetaSync {
    readonly fingerprint: string;
    readonly docMeta: IDocMeta;
}
