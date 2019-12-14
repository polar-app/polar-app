import * as React from 'react';
import {Button} from "reactstrap";

export class ActionButton extends React.Component<IProps> {
    public render() {

        return (

            <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                 }}>

                <Button color="primary"
                        style={{outline: 'none', boxShadow: 'none'}}
                        onClick={() => this.props.onClick()}
                        className="btn-circle btn-xl shadow-mg">

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
    readonly onClick: () => void;
}




