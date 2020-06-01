import * as React from 'react';
import {Button} from "reactstrap";

export class ActionButton extends React.Component<IProps> {
    public render() {

        const color = this.props.color || 'primary';

        return (

            <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                 }}>

                <Button color={color}
                        style={{outline: 'none', boxShadow: 'none'}}
                        onClick={() => this.props.onClick()}
                        className="btn-circle btn-lg shadow">

                    <i className={this.props.icon}/>

                </Button>

                <div className="ml-auto mr-auto">
                    {this.props.text || ""}
                </div>

            </div>

        );

    }

}

export interface IProps {
    readonly icon: string;
    readonly text?: string;
    readonly color?: 'success' | 'primary';
    readonly onClick: () => void;
}




