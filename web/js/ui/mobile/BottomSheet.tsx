import * as React from 'react';

/**
 * A sheet anchored to the bottom of the page.
 */
export class BottomSheet extends React.Component<IProps> {

    public render() {

        const zIndex = 1000000;

        // TODO: make this a transition so it floats up from the bottom.
        return (

            <div style={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     width: '100%',
                     height: '100%',
                     zIndex,
                     display: 'flex',
                     flexDirection: 'column'
                 }}>

                <div style={{
                         flexGrow: 1,
                         backgroundColor: '#000000',
                         opacity: 0.7,
                     }}>

                </div>

                <div className="rounded-top"
                     style={{
                        width: '100%',
                        backgroundColor: 'var(--primary-background-color)',
                     }}>

                    {this.props.children}

                </div>

            </div>

        );

    }

}

export interface IProps {
}

