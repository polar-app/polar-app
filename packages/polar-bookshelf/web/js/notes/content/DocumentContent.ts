import {makeObservable, observable, computed} from "mobx"
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";
import {DeviceIDStr} from "polar-shared/src/util/DeviceIDManager";
import {IDocumentContent} from "polar-blocks/src/blocks/content/IDocumentContent";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IAnnotationInfo} from "polar-shared/src/metadata/IAnnotationInfo";
import {IAttachment} from "polar-shared/src/metadata/IAttachment";

export class DocumentContent implements IDocumentContent, IBaseBlockContent {

    @observable private readonly _type: 'document';
    @observable private _mutator: DeviceIDStr;
    @observable private _docInfo: IDocInfo;
    @observable private _annotationInfo: IAnnotationInfo;
    @observable private _version: number;
    @observable private _attachments: { [id: string]: IAttachment };

    constructor(opts: IDocumentContent) {

        this._type = opts.type;
        this._docInfo = opts.docInfo;
        this._annotationInfo = opts.annotationInfo;
        this._version = opts.version;
        this._attachments = opts.attachments;
        this._mutator = opts.mutator || '';

        makeObservable(this);

    }

    @computed get type() {
        return this._type;
    }

    @computed get docInfo() {
        return this._docInfo;
    }

    @computed get annotationInfo() {
        return this._annotationInfo;
    }

    @computed get version() {
        return this._version;
    }

    @computed get mutator() {
        return this._mutator;
    }

    @computed get attachments() {
        return this._attachments;
    }

    public update(content: IBlockContent) {
        if (content.type === this._type) {
            this._docInfo = content.docInfo;
            this._annotationInfo = content.annotationInfo;
            this._version = content.version;
            this._attachments = content.attachments;
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
            annotationInfo: this.annotationInfo,
            version: this._version,
            attachments: this._attachments,
            mutator: this._mutator,
        };
    }

}

