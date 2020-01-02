import React from 'react';
import {Devices} from "../util/Devices";

export class BlackoutCurtain extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
        };

    }

    public render() {

        const style: React.CSSProperties = {

            // the positioning
            position: "absolute",
            zIndex: 999999999,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',

            // force things to be centered
            display: 'flex',
            alignItems: 'center',
            backdropFilter: 'blur(5px)'

        };

        if (Devices.isDesktop()) {
            // on the desktop we don't want to use a modal.
            style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }

        return (

            <div className="p-auto blackout-curtain"
                 style={style}>

                {this.props.children}

            </div>

        );

    }

}

interface IProps {
}

interface IState {
}
