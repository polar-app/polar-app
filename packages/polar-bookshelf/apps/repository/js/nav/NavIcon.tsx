import * as React from 'react';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {Link} from "react-router-dom";
import {Platforms} from "polar-shared/src/util/Platforms";
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";
import {Devices} from "polar-shared/src/util/Devices";

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
export class NavIcon extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const createLink = () => {

            if (Devices.get() === 'desktop') {
                return '/';
            } else {
                return '/annotations';
            }

        };

        const link = createLink();

        const NavLink = (props: any) => {
            return <Link to={{pathname: link, hash: '#'}}>
                {props.children}
            </Link>;
        };

        return (
            <div style={Styles.parent}>
                <div style={Styles.child}>
                    <NavLink>
                        <div className="mt-auto mb-auto"
                             style={{
                                 height: '35px',
                                 width: '35px'
                             }}>
                            <PolarSVGIcon/>
                        </div>

                    </NavLink>
                </div>
            </div>
        );

    }

}

interface IProps {

}

interface IState {

}
