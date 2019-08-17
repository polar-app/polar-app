import {IRect} from "../IRect";

const {SerializedObject} = require("./SerializedObject.js");

export class TextRect extends SerializedObject implements ITextRect {

    public readonly text: string;

    public readonly rect: IRect;

    constructor(val: any) {

        super(val);

        this.text = val.text;
        this.rect = val.rect;

        this.init(val);

    }

}

export interface ITextRect {

    /**
     * The actual text in this rect.
     */
    readonly text: string;

    /**
     * A rect area that the user has selected text.
     */
    readonly rect: IRect;

}
