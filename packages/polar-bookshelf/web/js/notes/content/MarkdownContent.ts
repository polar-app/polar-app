import {computed, createAtom, observable, toJS} from "mobx"
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {IMarkdownContent} from "polar-blocks/src/blocks/content/IMarkdownContent";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";
import {DeviceIDStr} from "polar-shared/src/util/DeviceIDManager";
import {HasLinks} from "./HasLinks";

let atomSequence = 0;

export class MarkdownContent extends HasLinks implements IMarkdownContent, IBaseBlockContent {

    @observable private readonly _type: 'markdown';
    @observable private _data: string;
    @observable private _mutator: DeviceIDStr;

    constructor(opts: IMarkdownContent) {
        super(opts);

        this._type = opts.type;
        this._data = opts.data;
        this._mutator = opts.mutator || '';

        this._atom = createAtom(`MarkdownContent#${atomSequence++}`, () => this.convertToObservable())

    }

    @computed get type() {
        this._atom.reportObserved();

        return this._type;
    }

    @computed get data() {
        this._atom.reportObserved();

        return this._data;
    }

    @computed get mutator() {
        this._atom.reportObserved();

        return this._mutator;
    }

    public update(content: IBlockContent) {
        this._atom.reportObserved();

        if (content.type === 'markdown') {
            this._data = content.data;
            this._mutator = content.mutator || '';
            this.updateLinks(content.links);
        } else {
            throw new Error("Invalid type: " +  content.type)
        }

    }

    public setMutator(mutator: DeviceIDStr) {
        this._atom.reportObserved();

        this._mutator = mutator;
    }

    public toJSON(): IMarkdownContent {
        return {
            type: this._type,
            data: this._data,
            links: toJS(this.links),
            mutator: this._mutator,
        };
    }
}

