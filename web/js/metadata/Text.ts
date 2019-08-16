
/**
 * Text mapping of TextType to string for each type of content generated which
 * represents this data.  This allow us to have an HTML version of the content,
 * MARKDOWN version, etc.
 */
export class Text implements IText {

    public readonly TEXT?: string;

    public readonly MARKDOWN?: string;

    public readonly HTML?: string;

}

export interface IText {

    readonly TEXT?: string;

    readonly MARKDOWN?: string;

    readonly HTML?: string;

}
