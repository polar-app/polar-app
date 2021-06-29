import {TDocumentData} from "./TDocumentData";
import {IDocumentSnapshot} from "./IDocumentSnapshot";

export interface IQueryDocumentSnapshot<SM> extends IDocumentSnapshot<SM> {

    readonly data: () => TDocumentData;

}
