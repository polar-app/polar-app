import * as React from 'react';
import {CircularIcon} from "./CircularIcon";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export class ActionButtonWithText extends React.Component<IProps> {
    public render() {

        const onClick = this.props.onClick || NULL_FUNCTION;

        const Btn = (props: any) => {
            // return <Button color="clear"
            //                onClick={onClick}
            //                style={{
            //                    alignItems: 'center'
            //                }}
            //                className="btn-no-outline p-0 pl-1 pr-1">
            //
            //     {props.children}
            //
            // </Button>;

            return null;
        };

        return (
            <div className="text-center">

                <Btn>
                    <CircularIcon icon={this.props.icon} />
                </Btn>

                <div>
                    <Btn>
                        <div className="mt-1 text-md">
                            {this.props.text}
                        </div>
                    </Btn>
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




