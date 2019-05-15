import * as React from 'react';
import {Tag} from '../../tags/Tag';
import Button from 'reactstrap/lib/Button';
import {Dialogs} from '../dialogs/Dialogs';
import {NULL_FUNCTION} from '../../util/Functions';

class Styles {


}

export class TagCreateButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onClick = this.onClick.bind(this);
        this.onCreated = this.onCreated.bind(this);

    }

    public render() {

        const disabled = this.props.selected.length !== 1;

        console.log("FIXME: ", this.props.selected);
        const tag = this.props.selected[0];

        return (
            <Button className="ml-1"
                    color="light"
                    disabled={disabled}
                    onClick={() => this.onClick(tag)}
                    title="Enter a name for ">

                <i className="hover-button fas fa-plus"/>

            </Button>
        );

    }

    private onClick(tag: Tag) {

        // FIXME: we need to constrain the input here so that users can't
        // create invalid folders.  We might have to have a 'filter' method
        // that's used with the dialog and invalid input shown instead of
        // accepting the tag directly.

        Dialogs.prompt({
            title: "Enter the name of a new folder:",

            onCancel: NULL_FUNCTION,

            onDone: value => this.onCreated(tag, value)

        });
    }

    private onCreated(tag: Tag, name: string) {
        const path = tag.label + '/' + name;
        this.props.onCreated(path);
    }

}

interface IProps {
    readonly selected: ReadonlyArray<Tag>;
    readonly onCreated: (path: string) => void;
}


interface IState {
}


