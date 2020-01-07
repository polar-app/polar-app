import * as React from 'react';

export class Lightbox extends React.Component<IProps> {

    public render() {

        return (
            <div style={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     width: '100%',
                     height: '100%',
                     backgroundColor: 'rgba(0, 0, 0, 0.7)',
                     zIndex: 9999,
                     display: 'flex'
                 }}>

                <div style={{
                         backgroundColor: 'var(--primary-background-color)',
                         margin: "auto",
                     }}>

                    {this.props.children}

                </div>

            </div>
        );

    }

}

interface IProps {
}
