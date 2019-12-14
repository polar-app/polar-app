import * as React from 'react';
import {Button} from "reactstrap";
import {CircularIcon} from "./CircularIcon";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export class ActionButtonWithText extends React.Component<IProps> {
    public render() {

        const onClick = this.props.onClick || NULL_FUNCTION;

        const Btn = (props: any) => {
            return <Button color="clear"
                    onClick={onClick}
                    style={{
                        padding: 0,
                        alignItems: 'center'
                    }}
                    className="btn-no-outline">

                {props.children}

            </Button>;

        };

        return (
            <div className="text-center">

                <Button color="clear"
                        onClick={onClick}
                        style={{
                            padding: 0,
                            alignItems: 'center'
                        }}
                        className="btn-no-outline">

                    <CircularIcon icon={this.props.icon} />

                </Button>

                <div className="mt-1 text-md">
                    {this.props.text}
                </div>
            </div>

        );

    }

}

export interface IProps {
    readonly icon: string;
    readonly text: string;
    readonly onClick?: () => void;
}




