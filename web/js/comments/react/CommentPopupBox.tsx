import * as React from 'react';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Button from 'reactstrap/lib/Button';
import Popover from 'reactstrap/lib/Popover';
import PopoverBody from 'reactstrap/lib/PopoverBody';

export class CommentPopupBox extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {
        return (
            <div className="border rounded p-2 shadow">

                <textarea placeholder="Enter a comment"
                          className="w-100">

                </textarea>

                <Button size="sm" color="primary" className="mt-2">Add Comment</Button>

            </div>
        );
    }

}

interface IProps {

}

interface IState {

}
