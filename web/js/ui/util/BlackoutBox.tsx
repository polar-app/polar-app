import * as React from 'react';

export class BlackoutBox extends React.Component<IProps, IState> {

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {
        return <div style={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        zIndex: 999
                    }}>

            {this.props.children}

        </div>;

    }

}

interface IProps {
}

interface IState {

}
