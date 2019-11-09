import * as React from 'react';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {Link} from "react-router-dom";
import {Platforms} from "../../../../web/js/util/Platforms";

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
export class NavLogo extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const createLink = () => {

            if (Platforms.isMobile()) {
                return '/#annotations';
            } else {
                return '/';
            }

        };

        const link = createLink();

        const NavLink = (props: any) => {
            return <Link to={{pathname: link, hash: '#'}}>
                {props.children}
            </Link>
        };

        return (
            <div style={Styles.parent}>
                <div style={Styles.child}>
                    <NavLink>
                        <img src="/apps/repository/img/icon.svg" height="25" alt="Polar"/>
                    </NavLink>
                </div>

                <div style={Styles.child}>
                    <div className="" style={Styles.textLogo}>POLAR</div>
                </div>
            </div>
        );

    }

}

interface IProps {

}

interface IState {

}
