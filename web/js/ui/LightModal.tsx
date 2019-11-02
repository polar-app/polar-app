import React from 'react';

export class LightModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
        };

    }

    public render() {
        return (

            <div className="p-auto"
                 style={{
                     position: "absolute",
                     zIndex: 999999999,
                     left: 0,
                     top: 0,
                     width: '100%',
                     height: '100%',

                     backgroundColor: 'rgba(0, 0, 0, 0.3)',

                 }}>

                {this.props.children}

            </div>

        );
    }

}

interface IProps {
}

interface IState {
}
