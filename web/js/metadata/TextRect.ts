import {IRect} from "../IRect";
import {ITextRect} from "./ITextRect";

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

