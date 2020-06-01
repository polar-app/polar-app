import React from 'react';
import {TimesIcon} from "../icons/FixedWidthIcons";
import {Button} from "reactstrap";

/**
 */
export class ResetButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <Button className="mt-auto mb-auto text-secondary p-0 no-focus"
                    style={{outline: 'none', boxShadow: 'none'}}
                    onClick={() => this.props.onClick()}
                    color="clear">

                <TimesIcon/>

            </Button>
        );

    }
}

interface IProps {
    readonly onClick: () => void;

}

interface IState {
}
