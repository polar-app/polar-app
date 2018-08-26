import {DocMeta} from '../../metadata/DocMeta';

export interface DocMetaSync {
    readonly fingerprint: string;
    readonly docMeta: DocMeta;
}
