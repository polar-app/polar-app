import React from 'react';
import {Platforms} from "../util/Platforms";

export class LightModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
        };

    }

    public render() {

        if (Platforms.isMobile()) {
            // on mobile we don't want to use a modal.
            return this.props.children;
        }

        return (

            <div className="p-auto"
                 style={{

                     // the positioning
                     position: "absolute",
                     zIndex: 999999999,
                     left: 0,
                     top: 0,
                     width: '100%',
                     height: '100%',

                     // used so that we can have a dark background
                     backgroundColor: 'rgba(0, 0, 0, 0.3)',

                     display: 'flex',
                     alignItems: 'center'

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
