import {IDStr} from "polar-shared/src/util/Strings";

export interface IAnnotationPtrInit {
    readonly target: IDStr;
    readonly docID: IDStr;
    readonly pageNum: number;
    readonly pos?: 'top' | 'bottom';
    readonly b?: number;

}

export interface IAnnotationPtr extends IAnnotationPtrInit {
    readonly n: string;
}

export namespace AnnotationPtrs {

    export function create(init: IAnnotationPtrInit): IAnnotationPtr {

        const nonce = Math.floor(Math.random() * 100000);

        return {
            ...init, n: `${nonce}`
        };

    }
}
