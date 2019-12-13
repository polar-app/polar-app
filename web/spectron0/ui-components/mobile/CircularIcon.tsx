import * as React from 'react';

/**
 * A sheet anchored to the bottom of the page.
 */
export class CircularIcon extends React.Component<IProps> {

    public render() {

        // TODO: make this a transition so it floats up from the bottom.
        return (

            <div className="border"
                 style={{
                     width: this.props.size,
                     height: this.props.size,
                     display: 'table-cell',
                     borderRadius: '50%',
                     textAlign: 'center',
                     verticalAlign: 'middle'
                 }}>

                <i className={this.props.icon}/>

            </div>

        );

    }

}

export interface IProps {
    readonly color?: 'primary' | 'success' | 'clear';
    readonly icon: string;
    readonly size: number | string;
}
