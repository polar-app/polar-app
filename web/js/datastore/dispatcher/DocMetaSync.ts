import {DocMeta} from '../../metadata/DocMeta';
import {IDocMeta} from "../../metadata/IDocMeta";

export interface DocMetaSync {
    readonly fingerprint: string;
    readonly docMeta: IDocMeta;
}
