import {computed, observable, toJS} from "mobx";
import {
    AnnotationContentType,
    IAnnotationContent,
    IAnnotationContentBase,
    IAreaHighlightAnnotationContent,
    IFlashcardAnnotationContent,
    ITextHighlightAnnotationContent
} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {DeviceIDStr} from "polar-shared/src/util/DeviceIDManager";
import {IDStr} from "polar-shared/src/util/Strings";
import {IBlockFlashcard} from "polar-blocks/src/annotations/IBlockFlashcard";
import {HasLinks} from "./HasLinks";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";

export abstract class AnnotationContentBase<T extends IAnnotationContent> extends HasLinks implements IAnnotationContentBase<T['type'], T['value']>, IBaseBlockContent {
    @observable private readonly _type: T['type'];
    @observable private _mutator: DeviceIDStr;
    @observable private _docID: IDStr;
    @observable private _pageNum: number;
    @observable private _value: T['value'];

    constructor(opts: T) {
        super(opts);

        this._type = opts.type;
        this._mutator = opts.mutator || '';
        this._docID = opts.docID;
        this._pageNum = opts.pageNum;
        this._value = opts.value;

        // FIXME: makeObservable(this);

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
            this.updateLinks(content.links);
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    private valueToJSON(value: T['value']): T['value'] {
        const serialized = JSON.parse(JSON.stringify(toJS(value)));
        return Dictionaries.onlyDefinedProperties(serialized);
    }

    public toJSON(): T {
        return {
            type: this._type,
            docID: this._docID,
            pageNum: this._pageNum,
            value: this.valueToJSON(this._value),
            mutator: this._mutator,
            links: toJS(this.links),
        } as T;
    }
}


export class TextHighlightAnnotationContent extends AnnotationContentBase<ITextHighlightAnnotationContent> {}

export class AreaHighlightAnnotationContent extends AnnotationContentBase<IAreaHighlightAnnotationContent> {}

export class FlashcardAnnotationContent<T extends IBlockFlashcard = IBlockFlashcard> extends AnnotationContentBase<IFlashcardAnnotationContent<T>> {
    constructor(opts: IFlashcardAnnotationContent<T>) {
        super(opts);
    }
}


export type AnnotationHighlightContent = TextHighlightAnnotationContent
                                         | AreaHighlightAnnotationContent;

export type AnnotationContent = AnnotationHighlightContent | FlashcardAnnotationContent;

export type AnnotationContentTypeMap = {
    [AnnotationContentType.FLASHCARD]: FlashcardAnnotationContent,
    [AnnotationContentType.TEXT_HIGHLIGHT]: TextHighlightAnnotationContent,
    [AnnotationContentType.AREA_HIGHLIGHT]: AreaHighlightAnnotationContent,
};
