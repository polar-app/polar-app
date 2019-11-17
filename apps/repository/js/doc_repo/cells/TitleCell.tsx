import * as React from 'react';

export class TitleCell extends React.PureComponent<IProps> {

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
