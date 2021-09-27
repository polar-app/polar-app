import {makeObservable, observable, computed, toJS} from "mobx"
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";
import {DeviceIDStr} from "polar-shared/src/util/DeviceIDManager";
import {IDocumentContent} from "polar-blocks/src/blocks/content/IDocumentContent";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {HasLinks} from "./HasLinks";

export class DocumentContent extends HasLinks implements IDocumentContent, IBaseBlockContent {

    @observable private readonly _type: 'document';
    @observable private _mutator: DeviceIDStr;
    @observable private _docInfo: IDocInfo;

    constructor(opts: IDocumentContent) {
        super(opts);

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
            this.updateLinks(content.links);
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
            docInfo: toJS(this._docInfo),
            mutator: this._mutator,
            links: toJS(this.links),
        };
    }

}

