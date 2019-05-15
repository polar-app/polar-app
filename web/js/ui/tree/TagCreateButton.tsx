import * as React from 'react';
import {Tag} from '../../tags/Tag';
import Button from 'reactstrap/lib/Button';

class Styles {


}

export class TagCreateButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }


    public render() {

        const disabled = this.props.selected.length !== 1;

        return (
            <Button className="ml-1"
                    color="light"
                    disabled={disabled}
                    title="Create new folder">

                <i className="hover-button fas fa-plus"/>

            </Button>
        );

    }

}

interface IProps {
    readonly selected: ReadonlyArray<Tag>;
}


interface IState {
}


