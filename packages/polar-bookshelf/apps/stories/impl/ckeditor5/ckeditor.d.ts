
declare module '@ckeditor/ckeditor5-react';
declare module '@ckeditor/ckeditor5-build-classic';
declare module '@ckeditor/ckeditor5-build-balloon';
declare module '@ckeditor/ckeditor5-upload';
declare module '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';
declare module '@ckeditor/ckeditor5-basic-styles/src/bold';
declare module '@ckeditor/ckeditor5-editor-balloon';
declare module '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';
declare module '@ckeditor/ckeditor5-core/src/context';


declare module '@ckeditor/ckeditor5-essentials/src/essentials';
declare module '@ckeditor/ckeditor5-autoformat/src/autoformat';
declare module '@ckeditor/ckeditor5-basic-styles/src/italic';
declare module '@ckeditor/ckeditor5-heading/src/heading';
declare module '@ckeditor/ckeditor5-link/src/link';
declare module '@ckeditor/ckeditor5-list/src/list';
declare module '@ckeditor/ckeditor5-paragraph/src/paragraph';

declare module '@ckeditor/ckeditor5-editor-classic/src/classiceditor' {
    export const EssentialsPlugin: any;
}

// declare module "@ckeditor/ckeditor5-engine/src/view/treewalker" {
//
//     // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_treewalker-TreeWalkerValueType.html
//     import INode = ckeditor5.INode;
//     import ITextProxy = ckeditor5.ITextProxy;
//     import IRange = ckeditor5.IRange;
//     import IPosition = ckeditor5.IPosition;
//     import IIterable = ckeditor5.IIterable;
//     import IIterator = ckeditor5.IIterator;
//     export type TreeWalkerValueType = 'elementStart' | 'elementEnd' | 'character' | 'text';
//
//     export interface ITreeWalkerValue {
//         readonly item: INode | ITextProxy;
//         readonly type: TreeWalkerValueType;
//     }
//
//     export type TreeWalkerDirection = 'backward' | 'forward';
//
//     export interface TreeWalkerOpts {
//
//         // default: forward
//         readonly direction?: TreeWalkerDirection;
//         readonly boundaries?: IRange;
//         readonly startPosition?: IPosition;
//
//         // default: false
//         readonly singleCharacters?: boolean;
//
//         // default: false
//         readonly shallow?: boolean;
//
//         // default: false
//         readonly ignoreElementEnd?: boolean;
//     }
//
//     // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_treewalker-TreeWalker.html
//     //
//     //
//     export class TreeWalker {
//
//         constructor(opts?: TreeWalkerOpts);
//
//         readonly [Symbol.iterator]: () => IIterator<ITreeWalkerValue>
//         readonly direction: TreeWalkerDirection;
//         readonly shallow: boolean;
//         readonly next: () => ITreeWalkerValue;
//
//     }
//
// }


// https://ckeditor.com/docs/ckeditor5/latest/framework/guides/architecture/editing-engine.html
declare namespace ckeditor5 {

    export interface IView {
        readonly focus: () => void;
        readonly document: IDocument;
        readonly domConverter: IDomConverter;
        readonly getDomRoot: () => Element;
    }

    export interface IEditing {
        readonly view: IView;
    }


    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_position-Position.html
    export interface IPosition {

        /**
         * Position offset converted to an index in position's parent node. It
         * is equal to the index of a node after this position. If position is
         * placed in text node, position index is equal to the index of that
         * text node.
         */
        readonly index: number;

        /**
         * Offset at which this position is located in its parent. It is equal
         * to the last item in position path.
         */
        readonly offset: number;

        /**
         * Is true if position is at the beginning of its parent, false otherwise.
         */
        readonly isAtStart: boolean;

        /**
         * Is true if position is at the end of its parent, false otherwise.
         */
        readonly isAtEnd: boolean;

        /**
         *  Returns text node instance in which this position is placed or null
         *  if this position is not in a text node.
         */
        readonly textNode: Text | null;

        /**
         * Node directly before this position or null if this position is in text node.
         */
        readonly nodeBefore: Node | null;

        /**
         * Node directly after this position or null if this position is in text node.
         */
        readonly nodeAfter: Node | null;

        /**
         * Parent element of this position.
         *
         * Keep in mind that parent value is calculated when the property is
         * accessed. If position path leads to a non-existing element, parent
         * property will throw error.
         *
         * Also it is a good idea to cache parent property if it is used
         * frequently in an algorithm (i.e. in a long loop).
         */
        readonly parent: IElement | IDocumentFragment;

        readonly isTouching: (otherPosition: IPosition) => boolean;

    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_selection-Selection.html
    export interface ISelection {
        readonly getFirstPosition: () => IPosition | null;
        readonly getLastPosition: () => IPosition | null;
        readonly getFirstRange: () => Range | null;
        readonly sourceElement: HTMLElement;
    }

    export interface IKeyPressEvent {
        readonly domEvent: KeyboardEvent;
    }

    export interface IEventData {
        readonly stop: () => void;
    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_documentfragment-DocumentFragment.html
    export interface IDocumentFragment {
        readonly childCount: number;
        readonly getChild: (index: number) => INode
        readonly getChildren: () => Iterable<INode>;
        readonly is: (type: NodeType) => boolean;

    }

    export type AttributeName = string;
    export type AttributeValue = string;

    export type IAttribute = [AttributeName, AttributeValue];

    export type NodeType = '$text' | 'node' | 'element' | 'documentFragment';

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_node-Node.html
    export interface INode {
        readonly is: (type: NodeType) => boolean;
    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_text-Text.html
    export interface IText extends INode {
        readonly data: string;
    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_element-Element.html
    export interface IElement extends INode {
        readonly name: string;
        readonly childCount: number;
        readonly document: IDocument;
        readonly nextSibling: INode | null;

        readonly getChild: (index: number) => INode
        readonly getChildren: () => Iterable<INode>;

        readonly getAttributes: () => IIterable<IAttribute>;
    }

    export interface IRootElement extends IElement {
    }

    export interface IIterator<T> {
        next(value?: any): IteratorResult<T>;
        return?(value?: any): IteratorResult<T>;
        throw?(e?: any): IteratorResult<T>;
    }

    export interface IIterable<T> {
        [Symbol.iterator](): IIterator<T>;
    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_documentselection-DocumentSelection.html
    export interface IDocumentSelection {

        readonly rangeCount: number;
        readonly isCollapsed: boolean;
        readonly isBackward: boolean;

        readonly getFirstPosition: () => IPosition | null;
        readonly getLastPosition: () => IPosition | null;
        readonly getRanges: () => IIterable<IRange>;

        readonly on: (eventName: 'change' | string, handler: (eventData: IEventData, event: IKeyPressEvent) => void) => void;
        readonly off: (eventName: 'change' | string, handler: (eventData: IEventData, event: IKeyPressEvent) => void) => void;

    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_document-Document.html
    export interface IDocument {
        readonly selection: IDocumentSelection;

        readonly on: (eventName: 'keydown' | 'enter' | 'click' | 'delete' | string, handler: (eventData: IEventData, event: IKeyPressEvent) => void) => void;
        readonly off: (eventName: 'keydown' | 'enter' | 'click' | 'delete' | string, handler: (eventData: IEventData, event: IKeyPressEvent) => void) => void;

        readonly getRoot: () => IRootElement;

    }

    export type TreeWalkerValueType = 'elementStart' | 'elementEnd' | 'character' | 'text';

    export interface ITreeWalkerValue {
        readonly item: INode | ITextProxy;
        readonly type: TreeWalkerValueType;
    }

    export type TreeWalkerDirection = 'backward' | 'forward';

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_range-Range.html
    export interface IRange {

        readonly isCollapsed: boolean;

        readonly isFlat: boolean;

        readonly [Symbol.iterator]: () => IIterator<ITreeWalkerValue>

    }

    interface IInsertTextAttributes {
        readonly bold?: boolean;
        readonly linkHref?: string;
    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_textproxy-TextProxy.html
    export interface ITextProxy {
        readonly data: string;
    }

    export type PositionPath = [number, number];

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_writer-Writer.html
    export interface IWriter {

        /**
         * Shortcut for Model#createRange().
         */
        readonly createRange: (start: IPosition, end?: IPosition) => IRange;

        readonly insertText: (text: string, attributes: IInsertTextAttributes, position: IPosition) => void;

        readonly remove: (itemOrRange: IRange) => void;

        readonly setSelection: (root: IRootElement | IRange, position?: number | 'before' | 'after' | 'end' | 'on' | 'in') => void;

        readonly createDocumentFragment: () => IDocumentFragment;

        readonly split: (position: IPosition) => void;

        readonly createPositionFromPath: (root: IRootElement, path: PositionPath) => IPosition;

    }

    export interface DeleteContentOpts {
        readonly leaveUnmerged?: boolean;
        readonly doNotResetEntireContent?: boolean;
        readonly doNotAutoparagraph?: boolean;
        readonly direction?: boolean;
    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_domconverter-DomConverter.html
    export interface IDomConverter {

        readonly mapViewToDom: (viewNode: INode) => Element | DocumentFragment | undefined;
    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_model-Model.html
    // https://ckeditor.com/docs/ckeditor5/latest/builds/guides/faq.html#where-are-the-editorinserthtml-and-editorinserttext-methods-how-to-insert-some-content
    export interface IModel {

        /**
         * Creates a range spanning from the start position to the end position.
         */
        readonly createRange: (start: IPosition, end?: IPosition) => IRange;
        readonly document: IDocument;
        readonly change: (writerHandler: (writer: IWriter) => void) => void;
        readonly createPositionBefore: (itemOrPosition: IPosition) => IPosition;
        readonly createPositionAfter: (itemOrPosition: IPosition) => IPosition;
        readonly createPositionAt: (itemOrPosition: INode | IPosition, offset?: number | 'end' | 'before' | 'after') => IPosition;
        readonly deleteContent: (selection: ISelection) => void;
        readonly getSelectedContent: (selection: ISelection) => DocumentFragment;

    }

    export interface InsertTableCommand {
        readonly execute: () => void;
    }

    export interface IInsertLinkCommandOpts {
        readonly linkIsExternal: boolean;
    }

    export interface InsertLinkCommand {
        readonly execute: (link: string, opts?: IInsertLinkCommandOpts) => void;
    }

    export interface ICommands {

        get(name: 'insertTable'): InsertTableCommand;
        get(name: 'link'): InsertLinkCommand;

    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_editor-balloon_ballooneditor-BalloonEditor.html
    export interface IEditor {
        readonly editing: IEditing;
        readonly model: IModel;
        readonly commands: ICommands;

        readonly getData: () => string;
        readonly setData: (data: string) => void;

    }

}
