import {computed, createAtom, observable, toJS} from "mobx"
import {IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {DateContentFormat, IDateContent} from "polar-blocks/src/blocks/content/IDateContent";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";
import {DeviceIDStr} from "polar-shared/src/util/DeviceIDManager";
import {HasLinks} from "./HasLinks";

let atomSequence = 0;

export class DateContent extends HasLinks implements IDateContent, IBaseBlockContent {

    @observable private readonly _type: 'date';
    @observable private _data: string;
    @observable private _format: DateContentFormat;
    @observable private _mutator: DeviceIDStr;

    constructor(opts: IDateContent) {
        super(opts);

        this._type = opts.type;
        this._data = opts.data;
        this._format = opts.format;
        this._mutator = opts.mutator || '';
        this._atom = createAtom(`DateContent#${atomSequence++}`, () => this.convertToObservable())

    }

    @computed get type() {
        this._atom.reportObserved();
        return this._type;
    }

    @computed get data() {
        this._atom.reportObserved();
        return this._data;
    }

    @computed get format() {
        this._atom.reportObserved();
        return this._format;
    }

    @computed get mutator() {
        this._atom.reportObserved();
        return this._mutator;
    }

    public update(content: IBlockContent) {
        this._atom.reportObserved();

        if (content.type === 'date') {
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

    public toJSON(): IDateContent {

        return {
            type: this._type,
            data: this._data,
            format: this._format,
            mutator: this._mutator,
            links: toJS(this.links),
        };

    }

}

