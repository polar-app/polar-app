import {IRect} from "../IRect";

const {SerializedObject} = require("./SerializedObject.js");

export class TextRect extends SerializedObject {

    constructor(val: any) {

        super(val);

        // the actual text in this rect.
        this.text = null;

        // A rect area that the user has selected text.
        this.rect = null;

        this.init(val);

    }

}

export interface ITextRect {
    readonly text: string;
    readonly rect: IRect;
}
