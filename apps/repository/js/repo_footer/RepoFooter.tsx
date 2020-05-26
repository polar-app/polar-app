import * as React from 'react';
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import HomeIcon from '@material-ui/icons/Home';
import NoteIcon from '@material-ui/icons/Note';
import SettingsIcon from '@material-ui/icons/Settings';
import {useHistory} from 'react-router-dom';
import ShowChartIcon from '@material-ui/icons/ShowChart';

export const RepoFooter = () => {

    const [value, setValue] = React.useState(0);

    const style: React.CSSProperties = {
        width: '100%',
    };

    const history = useHistory();

    function pushHistory(pathname: string) {
        history.push({pathname});
    }

    const BottomSheet =
        <footer className="border-top text-lg"
                style={style}>

            <BottomNavigation
                 color="secondary"
                 value={value}
                 onChange={(event, newValue) => {
                     setValue(newValue);
                 }}
                 showLabels
                 style={{
                     display: 'flex'
                 }}>

                <BottomNavigationAction label="Home"
                                        onClick={() => pushHistory('/')}
                                        icon={<HomeIcon />} />

                <BottomNavigationAction label="Annotations"
                                        onClick={() => pushHistory('/annotations')}
                                        icon={<NoteIcon />} />

                <BottomNavigationAction label="Stats"
                                        onClick={() => pushHistory('/stats')}
                                        icon={<ShowChartIcon />} />

                <BottomNavigationAction label="Settings"
                                        onClick={() => pushHistory('/settings')}
                                        icon={<SettingsIcon />} />

            </BottomNavigation>

        </footer>;

    return (

        <DeviceRouter handheld={BottomSheet}/>

    );

};
