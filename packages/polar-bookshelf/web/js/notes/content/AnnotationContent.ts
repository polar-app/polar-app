import {computed, makeObservable, observable} from "mobx";
import {IAnnotationContentType, IAreaHighlightAnnotationContent, ICommentAnnotationContent, IFlashcardAnnotationContent, ITextHighlightAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IComment} from "polar-shared/src/metadata/IComment";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {DeviceIDStr} from "polar-shared/src/util/DeviceIDManager";
import {IDStr} from "polar-shared/src/util/Strings";

// TODO: find a way to refactor these 4

export class TextHighlightAnnotationContent implements ITextHighlightAnnotationContent, IBaseBlockContent {
    @observable private readonly _type: IAnnotationContentType.TEXT_HIGHLIGHT;
    @observable private _mutator: DeviceIDStr;
    @observable private _docID: IDStr;
    @observable private _pageNum: number;
    @observable private _value: ITextHighlight;

    constructor(opts: ITextHighlightAnnotationContent) {

        this._type = opts.type;
        this._mutator = opts.mutator || '';
        this._docID = opts.docID;
        this._pageNum = opts.pageNum;
        this._value = opts.value;

        makeObservable(this);

    }

    @computed get type() {
        return this._type;
    }

    @computed get mutator() {
        return this._mutator;
    }

    @computed get docID() {
        return this._docID;
    }

    @computed get pageNum() {
        return this._pageNum;
    }

    @computed get value() {
        return this._value;
    }

    public setMutator(mutator: DeviceIDStr) {
        this._mutator = mutator;
    }

    public update(content: IBlockContent) {
        if (content.type === this._type) {
            this._pageNum = content.pageNum;
            this._docID = content.docID;
            this._value = content.value;
            this._mutator = content.mutator || '';
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    public toJSON(): ITextHighlightAnnotationContent {
        return {
            type: this._type,
            docID: this._docID,
            pageNum: this._pageNum,
            value: this._value,
            mutator: this._mutator,
        };
    }
}

export class AreaHighlightAnnotationContent implements IAreaHighlightAnnotationContent, IBaseBlockContent {
    @observable private readonly _type: IAnnotationContentType.AREA_HIGHLIGHT;
    @observable private _mutator: DeviceIDStr;
    @observable private _docID: IDStr;
    @observable private _pageNum: number;
    @observable private _value: IAreaHighlight;

    constructor(opts: IAreaHighlightAnnotationContent) {

        this._type = opts.type;
        this._mutator = opts.mutator || '';
        this._docID = opts.docID;
        this._pageNum = opts.pageNum;
        this._value = opts.value;

        makeObservable(this);

    }

    @computed get type() {
        return this._type;
    }

    @computed get mutator() {
        return this._mutator;
    }

    @computed get docID() {
        return this._docID;
    }

    @computed get pageNum() {
        return this._pageNum;
    }

    @computed get value() {
        return this._value;
    }

    public setMutator(mutator: DeviceIDStr) {
        this._mutator = mutator;
    }

    public update(content: IBlockContent) {
        if (content.type === this._type) {
            this._pageNum = content.pageNum;
            this._docID = content.docID;
            this._value = content.value;
            this._mutator = content.mutator || '';
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    public toJSON(): IAreaHighlightAnnotationContent {
        return {
            type: this._type,
            docID: this._docID,
            pageNum: this._pageNum,
            value: this._value,
            mutator: this._mutator,
        };
    }
}

export class CommentAnnotationContent implements ICommentAnnotationContent, IBaseBlockContent {
    @observable private readonly _type: IAnnotationContentType.COMMENT;
    @observable private _mutator: DeviceIDStr;
    @observable private _docID: IDStr;
    @observable private _pageNum: number;
    @observable private _value: IComment;

    constructor(opts: ICommentAnnotationContent) {

        this._type = opts.type;
        this._mutator = opts.mutator || '';
        this._docID = opts.docID;
        this._pageNum = opts.pageNum;
        this._value = opts.value;

        makeObservable(this);

    }

    @computed get type() {
        return this._type;
    }

    @computed get mutator() {
        return this._mutator;
    }

    @computed get docID() {
        return this._docID;
    }

    @computed get pageNum() {
        return this._pageNum;
    }

    @computed get value() {
        return this._value;
    }

    public setMutator(mutator: DeviceIDStr) {
        this._mutator = mutator;
    }

    public update(content: IBlockContent) {
        if (content.type === this._type) {
            this._pageNum = content.pageNum;
            this._docID = content.docID;
            this._value = content.value;
            this._mutator = content.mutator || '';
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    public toJSON(): ICommentAnnotationContent {
        return {
            type: this._type,
            docID: this._docID,
            pageNum: this._pageNum,
            value: this._value,
            mutator: this._mutator,
        };
    }
}

export class FlashcardAnnotationContent implements IFlashcardAnnotationContent, IBaseBlockContent {
    @observable private readonly _type: IAnnotationContentType.FLASHCARD;
    @observable private _mutator: DeviceIDStr;
    @observable private _docID: IDStr;
    @observable private _pageNum: number;
    @observable private _value: IFlashcard;

    constructor(opts: IFlashcardAnnotationContent) {

        this._type = opts.type;
        this._mutator = opts.mutator || '';
        this._docID = opts.docID;
        this._pageNum = opts.pageNum;
        this._value = opts.value;

        makeObservable(this);

    }

    @computed get type() {
        return this._type;
    }

    @computed get mutator() {
        return this._mutator;
    }

    @computed get docID() {
        return this._docID;
    }

    @computed get pageNum() {
        return this._pageNum;
    }

    @computed get value() {
        return this._value;
    }

    public setMutator(mutator: DeviceIDStr) {
        this._mutator = mutator;
    }

    public update(content: IBlockContent) {
        if (content.type === this._type) {
            this._pageNum = content.pageNum;
            this._docID = content.docID;
            this._value = content.value;
            this._mutator = content.mutator || '';
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    public toJSON(): IFlashcardAnnotationContent {
        return {
            type: this._type,
            docID: this._docID,
            pageNum: this._pageNum,
            value: this._value,
            mutator: this._mutator,
        };
    }
}


export type AnnotationContent = TextHighlightAnnotationContent
                                | AreaHighlightAnnotationContent
                                | CommentAnnotationContent
                                | FlashcardAnnotationContent;
