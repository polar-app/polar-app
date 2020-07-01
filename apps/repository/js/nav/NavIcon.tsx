import * as React from 'react';
import {Link} from "react-router-dom";
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";
import {Devices} from "polar-shared/src/util/Devices";

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

        const NavLink = (props: any) => (
            <Link to={{pathname: link, hash: '#'}}
                  style={{
                      display: 'flex',
                      alignItems: 'center'
                  }}>

                {props.children}

            </Link>
        );

        return (
            <NavLink>
                <PolarSVGIcon width={35} height={35}/>
            </NavLink>
        );

    }

}

interface IProps {

}

interface IState {

}
