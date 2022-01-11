import {computed, observable, toJS} from "mobx"
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";
import {DeviceIDStr} from "polar-shared/src/util/DeviceIDManager";
import {IDocumentContent} from "polar-blocks/src/blocks/content/IDocumentContent";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {HasLinks} from "./HasLinks";
import {Atoms} from "../Atoms";

export class DocumentContent extends HasLinks implements IDocumentContent, IBaseBlockContent {

    @observable private readonly _type: 'document';
    @observable private _mutator: DeviceIDStr;
    @observable private _docInfo: IDocInfo;

    constructor(opts: IDocumentContent) {
        super(opts);

        this._type = opts.type;
        this._docInfo = opts.docInfo;
        this._mutator = opts.mutator || '';

        this._atom = Atoms.create(`DocumentContent`, () => this.convertToObservable())

    }

    @computed get type() {
        this._atom.reportObserved('type');

        return this._type;
    }

    @computed get docInfo() {
        this._atom.reportObserved('docInfo');

        return this._docInfo;
    }

    @computed get mutator() {
        this._atom.reportObserved('mutator');

        return this._mutator;
    }

    public update(content: IBlockContent) {
        this._atom.reportObserved('update');

        if (content.type === this._type) {
            this._docInfo = content.docInfo;
            this._mutator = content.mutator || '';
            this.updateLinks(content.links);
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    public setMutator(mutator: DeviceIDStr) {
        this._atom.reportObserved('setMutator');

        this._mutator = mutator;
    }

    public toJSON(): IDocumentContent {
        return {
            type: this._type,
            mutator: this._mutator,
            docInfo: toJS(this._docInfo),
            links: toJS(this.links),
        };
    }

}

