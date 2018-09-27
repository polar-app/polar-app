import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Popover from 'reactstrap/lib/Popover';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import PopoverHeader from 'reactstrap/lib/PopoverHeader';
import {CommentEvent} from './CommentEvent';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {Point} from '../../Point';

export class CommentPopupBox extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);

        this.state = {
            popoverOpen: false
        };

        this.props.commentEventDispatcher.addEventListener(event => {
            console.log("FIXME got comment event")
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

                <Popover placement="bottom"
                         id="comment-popup-box-popover"
                         isOpen={this.state.popoverOpen}
                         target="comment-anchor"
                         toggle={this.toggle}
                         style={{width: '400px'}}>
                    <PopoverHeader>Add Comment</PopoverHeader>
                    <PopoverBody>

                         <textarea placeholder="Enter comment your comment here. Full HTML and images supported."
                                   className="w-100">

                         </textarea>

                         <Button size="sm" color="primary" className="mt-2">Add Comment</Button>

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
