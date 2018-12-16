/* global $ */

import $ from '../../../../ui/JQuery';
import 'bootstrap';
import 'summernote/dist/summernote-bs4';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
const randomUid = () => Math.floor(Math.random() * 100000);

/**
 * React Summernote for Twitter Boostrap v4
 */
export class ReactSummernote4 extends Component {

    private readonly uid: string;

    private editor: any;

    private noteEditable: any;

    private notePlaceholder: any;

    readonly props : any;

    // ReactSummernote.propTypes = {
    //     value: PropTypes.string,
    //     defaultValue: PropTypes.string,
    //     codeview: PropTypes.bool,
    //     className: PropTypes.string,
    //     options: PropTypes.object,
    //     disabled: PropTypes.bool,

    //     onInit: PropTypes.func,
    //     onEnter: PropTypes.func,
    //     onFocus: PropTypes.func,
    //     onBlur: PropTypes.func,
    //     onKeyUp: PropTypes.func,
    //     onKeyDown: PropTypes.func,
    //     onPaste: PropTypes.func,
    //     onChange: PropTypes.func,
    //     onImageUpload: PropTypes.func
    // };

    constructor(props: any) {
        super(props);

        this.props = props;

        if (this.props.options.id) {
            this.uid = this.props.options.id;
        } else {
            this.uid = `react-summernote-${randomUid()}`;
        }

        this.editor = {};
        this.noteEditable = null;
        this.notePlaceholder = null;

        this.onInit = this.onInit.bind(this);
        this.onImageUpload = this.onImageUpload.bind(this);
        this.focus = this.focus.bind(this);
        this.isEmpty = this.isEmpty.bind(this);
        this.reset = this.reset.bind(this);
        this.replace = this.replace.bind(this);
        this.disable = this.disable.bind(this);
        this.enable = this.enable.bind(this);
        this.toggleState = this.toggleState.bind(this);
        this.insertImage = this.insertImage.bind(this);
        this.insertNode = this.insertNode.bind(this);
        this.insertText = this.insertText.bind(this);

    }

    componentDidMount() {
        const options = this.props.options || {};
        const codeview = this.props.codeview;
        // const codeviewCommand = codeview ? 'codeview.activate' : 'codeview.deactivate';
        options.callbacks = this.callbacks;

        const domNode = ReactDOM.findDOMNode(this) as HTMLElement;

        this.editor = $(domNode).find(`#${this.uid}`);

        this.editor.summernote(options);

        if (codeview) {
            this.editor.summernote('codeview.activate');
        }

        if (options.airMode) {

            domNode.parentElement!.addEventListener('click', () => {
                this.editor.summernote('focus');
            });

        }

    }

    componentWillReceiveProps(nextProps: any) {

        const { props } = this;

        const codeview = nextProps.codeview;
        const codeviewCommand = codeview ? 'codeview.activate' : 'codeview.deactivate';

        if (typeof nextProps.value === 'string' && props.value !== nextProps.value) {
            this.replace(nextProps.value);
        }

        if (typeof nextProps.disabled === 'boolean' && props.disabled !== nextProps.disabled) {
            this.toggleState(nextProps.disabled);
        }

        if (codeview !== props.codeview) {
            this.editor.summernote(codeviewCommand);
        }

        if (this.props.autofocus) {
            this.editor.summernote('focus');
        }

    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillUnmount() {
        if (this.editor.summernote) {
            this.editor.summernote('destroy');
        }
    }

    onInit() {

        const { disabled, onInit } = this.props;

        const $container = this.editor.parent();

        this.noteEditable = $container.find('.note-editable');
        this.notePlaceholder = $container.find('.note-placeholder');

        if (typeof disabled === 'boolean') {
            this.toggleState(disabled);
        }

        if (typeof onInit === 'function') {
            onInit({
                summernote: this.editor.summernote.bind(this.editor),
                focus: this.focus,
                isEmpty: this.isEmpty,
                reset: this.reset,
                replace: this.replace,
                disable: this.disable,
                enable: this.enable,
                insertImage: this.insertImage,
                insertNode: this.insertNode,
                insertText: this.insertText
            });
        }
    }

    onImageUpload(images: any) {

        const { onImageUpload } = this.props;

        if (typeof onImageUpload === 'function') {
            onImageUpload(images, this.insertImage);
        }
    }

    focus() {
        this.editor.summernote('focus');
    }

    isEmpty() {
        return this.editor.summernote('isEmpty');
    }

    reset() {
        this.editor.summernote('reset');
    }

    replace(content: any) {
        const { noteEditable, notePlaceholder } = this;
        const prevContent = noteEditable.html();
        const contentLength = content.length;

        if (prevContent !== content) {
            if (this.isEmpty() && contentLength > 0) {
                notePlaceholder.hide();
            } else if (contentLength === 0) {
                notePlaceholder.show();
            }

            noteEditable.html(content);
        }
    }

    disable() {
        this.editor.summernote('disable');
    }

    enable() {
        this.editor.summernote('enable');
    }

    toggleState(disabled: boolean) {
        if (disabled) {
            this.disable();
        } else {
            this.enable();
        }
    }

    insertImage(url: any, filenameOrCallback: any) {
        this.editor.summernote('insertImage', url, filenameOrCallback);
    }

    insertNode(node: Node) {
        this.editor.summernote('insertNode', node);
    }

    insertText(text: Node) {
        this.editor.summernote('insertText', text);
    }

    get callbacks() {
        const props = this.props;

        return {
            onInit: this.onInit,
            onEnter: props.onEnter,
            onFocus: props.onFocus,
            onBlur: props.onBlur,
            onKeyup: props.onKeyUp,
            onKeydown: props.onKeyDown,
            onPaste: props.onPaste,
            onChange: props.onChange,
            onImageUpload: this.onImageUpload
        };
    }

    public render() {
        const { value, defaultValue, className } = this.props;
        const html = value || defaultValue;

        return (
            <div className={className}>
                <div id={this.uid} dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        );
    }

}
