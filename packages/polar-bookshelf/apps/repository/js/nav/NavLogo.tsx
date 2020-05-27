import * as React from 'react';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";
import {Devices} from "polar-shared/src/util/Devices";
import {MUIRouterLink} from "../../../../web/js/mui/MUIRouterLink";

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
export const NavLogo = React.memo(() => {

    const createLink = () => {

        if (Devices.get() === 'desktop') {
            return '/';
        } else {
            return '/annotations';
        }

    };

    const link = createLink();

    const NavLink = (props: any) => {
        return (
            <MUIRouterLink to={{pathname: link, hash: '#'}}>
                {props.children}
            </MUIRouterLink>
        );
    };

    return (
        <div style={Styles.parent}>
            <div style={Styles.child}>
                <NavLink>

                    <div style={{
                        height: '50px',
                        width: '50px'
                    }}>
                        <PolarSVGIcon/>
                    </div>

                </NavLink>
            </div>

            <div style={Styles.child}>
                <NavLink>
                    <div style={Styles.textLogo}>POLAR</div>
                </NavLink>
            </div>

        </div>
    );

});

