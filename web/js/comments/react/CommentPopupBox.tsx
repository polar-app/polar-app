import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Popover from 'reactstrap/lib/Popover';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import PopoverHeader from 'reactstrap/lib/PopoverHeader';
import {CommentEvent} from './CommentEvent';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {Point} from '../../Point';
import {ReactSummernote4} from '../../apps/card_creator/elements/schemaform/ReactSummernote4';

export class CommentPopupBox extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);

        this.state = {
            popoverOpen: false
        };

        this.props.commentEventDispatcher.addEventListener(event => {
            this.show(event.point);
        });

    }

    public show(point: Point) {

        document.getElementById('comment-anchor')!.style.cssText
            = `position: absolute; top: ${point.y}px; left: ${point.x}px;`;

        this.toggle();

    }

    public toggle() {

        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    public render() {
        return (

            <div id="comment-popup-box">

                <div id="comment-anchor"></div>

                {/*<Button id="comment-anchor" onClick={this.toggle}>*/}
                    {/*Launch Popover*/}
                {/*</Button>*/}

                <Popover placement="bottom"
                         id="comment-popup-box-popover"
                         isOpen={this.state.popoverOpen}
                         target="comment-anchor"
                         toggle={this.toggle}
                         style={{width: '650px'}}>
                    <PopoverHeader>Add Comment</PopoverHeader>
                    <PopoverBody>

                        {/*<div className="border rounded p-1">*/}
                            {/*<ReactSummernote4 className="w-100"*/}

                            {/*value=""*/}
                            {/*options={{*/}
                                {/*id: 'my-summernote',*/}
                                {/*lang: 'en-US',*/}
                                {/*height: 400,*/}
                                {/*placeholder: "Enter your comment.",*/}
                                {/*dialogsInBody: false,*/}
                                {/*airMode: true,*/}
                                {/*// toolbar: [*/}
                                {/*//     ['style', []],*/}
                                {/*//     ['font', []],*/}
                                {/*//     ['fontname', []],*/}
                                {/*//     ['para', []],*/}
                                {/*//     ['table', []],*/}
                                {/*//     ['insert', []],*/}
                                {/*//     ['view', []],*/}
                                {/*//     ['image', []]*/}
                                {/*// ]*/}

                                {/*// FIXME: add blockquote, code, and pre, and cite*/}

                                {/*// missing the highlight color pulldown...*/}

                                {/*toolbar: [*/}
                                    {/*['style', ['style']],*/}
                                    {/*['font', ['bold', 'italic', 'underline', 'clear', 'color', 'superscript', 'subscript']],*/}
                                    {/*// ['fontname', ['fontname']],*/}
                                    {/*['para', ['ul', 'ol', 'paragraph']],*/}
                                    {/*['table', ['table']],*/}
                                    {/*['insert', ['link', 'picture', 'video']],*/}
                                    {/*['view', []]*/}
                                {/*]*/}

                            {/*}}*/}
                        {/*/>*/}
                        {/*</div>*/}

                        <div>
                            <textarea></textarea>
                        </div>

                        <div>
                            <Button size="sm" color="primary" className="mt-2">
                                Comment
                            </Button>
                        </div>

                    </PopoverBody>

                </Popover>

            </div>
            // <div className="border rounded p-2 shadow">
            //
            //
            //
            //     <textarea placeholder="Enter a comment"
            //               className="w-100">
            //
            //     </textarea>
            //
            //     <Button size="sm" color="primary" className="mt-2">Add Comment</Button>
            //
            // </div>
        );
    }

}

interface IProps {
    commentEventDispatcher: IEventDispatcher<CommentEvent>;
}

interface IState {
    popoverOpen: boolean;
}
