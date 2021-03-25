import * as React from 'react';
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import HomeIcon from '@material-ui/icons/Home';
import NoteIcon from '@material-ui/icons/Note';
import SettingsIcon from '@material-ui/icons/Settings';
import {useHistory, useLocation} from 'react-router-dom';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {MUIPaperToolbar} from "../../../../web/js/mui/MUIPaperToolbar";

interface ILink {
    readonly pathname: string;
}

interface IBottomNavLink {
    readonly label: string,
    readonly icon: React.ReactElement,
    readonly link: ILink;
}

const navLinks: ReadonlyArray<IBottomNavLink> = [
    {
        label: "Home",
        icon: <HomeIcon />,
        link: {
            pathname: "/"
        }
    },
    // {
    //     label: "Annotations",
    //     icon: <NoteIcon />,
    //     link: {
    //         pathname: "/annotations"
    //     }
    // },
    {
        label: "Stats",
        icon: <ShowChartIcon />,
        link: {
            pathname: "/stats"
        }
    },
    {
        label: "Settings",
        icon: <SettingsIcon />,
        link: {
            pathname: "/settings"
        }
    },
];


const BottomNav = () => {

    const history = useHistory();
    const location = useLocation();

    function pushHistory(pathname: string) {
        history.push({pathname});
    }

    /**
     * Look at the location and see which of the nav buttons is active.
     */
    function computeValue(): number | undefined {

        const activeNavLink =
            arrayStream(navLinks)
                .withIndex()
                .filter((current, idx) => current.value.link.pathname === location.pathname)
                .first();

        return activeNavLink?.index;

    }

    const value = computeValue();

    return (

        <BottomNavigation
            color="secondary"
            value={value}
            showLabels
            style={{
                display: 'flex'
            }}>

            {navLinks.map((current, idx) =>
                <BottomNavigationAction key={idx}
                                        label={current.label}
                                        onClick={() => pushHistory(current.link.pathname)}
                                        icon={current.icon}/>)}

        </BottomNavigation>

    );

};


export const RepoFooter = () => {

    const style: React.CSSProperties = {
        width: '100%',
    };

    const BottomSheet =
        <footer className="border-top text-lg"
                style={style}>

            <MUIPaperToolbar borderTop>
                <BottomNav/>
            </MUIPaperToolbar>

        </footer>;

    return (

        <DeviceRouter handheld={BottomSheet}/>

    );

};
