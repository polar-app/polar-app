import * as React from 'react';

/**
 * A sheet anchored to the bottom of the page.
 */
export class CircularIcon extends React.Component<IProps> {

    public render() {

        interface Size {
            readonly icon: string;
            readonly text: string;
        }

        const size: Size = {
            icon: '50px',
            text: '20px'
        };

        const color = this.props.color || 'primary';

        // TODO: make this a transition so it floats up from the bottom.
        return (

            <div className="border"
                 style={{
                     width: size.icon,
                     height: size.icon,
                     display: 'table-cell',
                     borderRadius: '50%',
                     textAlign: 'center',
                     verticalAlign: 'middle'
                 }}>

                <i style={{
                       fontSize: size.text,
                       color: `var(--${color})`
                   }}
                   className={this.props.icon}/>

            </div>

        );

    }

}

export interface IProps {
    readonly icon: string;
    readonly color?: 'primary' | 'success' | 'clear';
}
