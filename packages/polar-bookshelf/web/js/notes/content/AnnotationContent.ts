import cloneDeep from "lodash/cloneDeep";
import {computed, makeObservable, observable, toJS} from "mobx";
import {IAnnotationContent, IAnnotationContentBase, IAnnotationContentType, IAreaHighlightAnnotationContent, ICommentAnnotationContent, IFlashcardAnnotationContent, ITextHighlightAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {DeviceIDStr} from "polar-shared/src/util/DeviceIDManager";
import {IDStr} from "polar-shared/src/util/Strings";

function cleanse<T extends { [key: string]: any }>(obj: T) {
    Object.keys(obj).forEach(function(key) {
        // Get this value and its type
        var value = obj[key];
        var type = typeof value;
        if (type === "object") {
            // Recurse...
            cleanse(value);
            // ...and remove if now "empty" (NOTE: insert your definition of "empty" here)
            if (!Object.keys(value).length) {
                delete obj[key]
            }
        }
        else if (type === "undefined") {
            // Undefined, remove it
            delete obj[key];
        }
    });
}

abstract class AnnotationContentBase<T extends IAnnotationContent> implements IAnnotationContentBase<T['type'], T['value']>, IBaseBlockContent {
    @observable private readonly _type: T['type'];
    @observable private _mutator: DeviceIDStr;
    @observable private _docID: IDStr;
    @observable private _pageNum: number;
    @observable private _value: T['value'];

    constructor(opts: T) {

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

    private valueToJSON(value: T['value']): T['value'] {
        const serialized = JSON.parse(JSON.stringify(toJS(value)));
        cleanse(serialized);
        return { ...serialized };
    }

    public toJSON(): T {
        return {
            type: this._type,
            docID: this._docID,
            pageNum: this._pageNum,
            value: this.valueToJSON(this._value),
            mutator: this._mutator,
        } as T;
    }
}

export class TextHighlightAnnotationContent extends AnnotationContentBase<ITextHighlightAnnotationContent> {}

export class AreaHighlightAnnotationContent extends AnnotationContentBase<IAreaHighlightAnnotationContent> {}

export class CommentAnnotationContent extends AnnotationContentBase<ICommentAnnotationContent> {}

export class FlashcardAnnotationContent extends AnnotationContentBase<IFlashcardAnnotationContent> {}


export type AnnotationContent = TextHighlightAnnotationContent
                                | AreaHighlightAnnotationContent
                                | CommentAnnotationContent
                                | FlashcardAnnotationContent;
