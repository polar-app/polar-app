import * as React from 'react';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {PolarSVGIcon} from "../../../../web/js/icons/PolarSVGIcon";
import {Devices} from "polar-shared/src/util/Devices";
import {MUIRouterLink} from "../../../../web/js/mui/MUIRouterLink";
import {RoutePathNames} from '../../../../web/js/apps/repository/RoutePathNames';

const Styles: IStyleMap = {
    child: {
        userSelect: 'none'
    },

    textLogo: {
        paddingLeft: '5px',
        fontWeight: 700,
        fontSize: '27px',
        userSelect: 'none',
        textDecoration: 'none'
    }

};

export const NavLogo = React.memo(function NavLogo() {

    const createLink = () => {

        if (Devices.get() === 'desktop') {
            return RoutePathNames.HOME;
        } else {
            return RoutePathNames.ANNOTATIONS;
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
        <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'nowrap',
             }}>
            <div style={Styles.child}>
                <NavLink>

                    <div style={{
                             height: '50px',
                             width: '50px',
                             display: 'flex',
                             alignItems: 'center',
                             flexWrap: 'nowrap',
                         }}>
                        <PolarSVGIcon width={50} height={50}/>
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

