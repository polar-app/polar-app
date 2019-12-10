import * as React from 'react';
import {Dictionaries} from "polar-shared/src/util/Dictionaries";

export class TitleCell extends React.Component<IProps> {

    public shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<any>, nextContext: any): boolean {
        return ! Dictionaries.equals(this.props, nextProps, ['id', 'title']);
    }

    public render() {

        return (<div id={this.props.id}>
                <div>{this.props.title}</div>
            </div>
        );

    }

}

interface IProps {
    readonly id: string;
    readonly title: string;
}
