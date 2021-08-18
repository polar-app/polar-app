import {makeObservable, observable, computed} from "mobx"
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";
import {DeviceIDStr} from "polar-shared/src/util/DeviceIDManager";
import {IDocumentContent} from "polar-blocks/src/blocks/content/IDocumentContent";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";

export class DocumentContent implements IDocumentContent, IBaseBlockContent {

    @observable private readonly _type: 'document';
    @observable private _mutator: DeviceIDStr;
    @observable private _docInfo: IDocInfo;

    constructor(opts: IDocumentContent) {

        this._type = opts.type;
        this._docInfo = opts.docInfo;
        this._mutator = opts.mutator || '';

        makeObservable(this);

    }

    @computed get type() {
        return this._type;
    }

    @computed get docInfo() {
        return this._docInfo;
    }

    @computed get mutator() {
        return this._mutator;
    }

    public update(content: IBlockContent) {
        if (content.type === this._type) {
            this._docInfo = content.docInfo;
            this._mutator = content.mutator || '';
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    public setMutator(mutator: DeviceIDStr) {
        this._mutator = mutator;
    }

    public toJSON(): IDocumentContent {
        return {
            type: this._type,
            docInfo: this.docInfo,
            mutator: this._mutator,
        };
    }

}

