import * as React from 'react';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';

const Styles: IStyleMap = {
    parent: {
        display: 'inline-block'
    },

    child: {
        display: 'inline-block',
        verticalAlign: 'middle',
        userSelect: 'none'
    },

    textLogo: {
        paddingLeft: '5px',
        fontWeight: 'bold',
        fontSize: '20px',
        userSelect: 'none',
        textDecoration: 'none'
    }

};

/**
 */
export class NavLogo extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <div style={Styles.parent}>
                <div style={Styles.child}>
                    <a href="#">
                        <img src="./img/icon.svg" height="25"/>
                    </a>
                </div>

                <div style={Styles.child}>
                    <div style={Styles.textLogo}>POLAR</div>
                </div>
            </div>
        );

    }

}

interface IProps {

}

interface IState {

}
