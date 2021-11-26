import {BottomNavigationAction} from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Paper from '@material-ui/core/Paper';
import * as React from 'react';
import {createStyles, makeStyles, Theme, useTheme} from "@material-ui/core/styles";
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import {useHistory, useLocation} from 'react-router-dom';
import {RoutePathNames} from '../apps/repository/RoutePathNames';
import CarouselIcon from '@material-ui/icons/ViewCarousel';
import {useSideNavStore} from '../sidenav/SideNavStore';
import {useRefWithUpdates} from '../hooks/ReactHooks';
import NotesIcon from '@material-ui/icons/Notes';
import {useFeatureToggle} from '../../../apps/repository/js/persistence_layer/PrefsContext2';

type IUseStylesProps = {
    show: boolean;
};

const useStyles = makeStyles<Theme, IUseStylesProps>((theme) =>
    createStyles({
        root: ({ show }) => ({
            transition: 'all 0ms ease-in-out',
            position: 'relative',
            width: '100%',
            bottom: 0,
            left: 0,
            zIndex: 3,
            ...(show
                ? { transform: 'translateY(0)' }
                : { transform: 'translateY(100%)', position: 'absolute' }
            ),
            '& .Mui-selected':{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
            },
        }),
    })
);

interface IBottomNavLocation {
    readonly id: string;
    readonly label: string;
    readonly href: string;
    readonly icon: React.ReactNode;
}

const useBottomNavLocations = (): ReadonlyArray<IBottomNavLocation> => {
    const notesEnabled = useFeatureToggle('notes-enabled');

    return React.useMemo(() => ([
        {
            id: 'home',
            label: 'Docs',
            href: '/',
            icon: <HomeIcon/>
        },
        ...(notesEnabled
                ? [{
                    id: 'notes',
                    label: 'Notes',
                    href: RoutePathNames.NOTES,
                    icon: <NotesIcon />
                }] : []
        ),
        {
            id: 'add',
            label: 'Add',
            href: RoutePathNames.ADD_MOBILE,
            icon: <AddIcon/>
        },
        {
            id: 'switch',
            label: 'Switch',
            href: RoutePathNames.SWITCH,
            icon: <CarouselIcon/>
        },
    ]), [notesEnabled]);
};

export const MUIBottomNavigation = ()  => {

    const {isOpen: isSidenavOpen} = useSideNavStore(['isOpen']);
    const theme = useTheme();
    const classes = useStyles({ show: ! isSidenavOpen });
    const history = useHistory();
    const [value, setValue] = React.useState('/');
    const bottomNavRef = React.useRef<HTMLDivElement>(null);
    const isSidenavOpenRef = useRefWithUpdates(isSidenavOpen);
    const bottomNavLocations = useBottomNavLocations();

    const location = useLocation();

    const changeRoute = React.useCallback((newValue: string) =>{

        if(newValue !== value){
            history.push(newValue);
        }

    }, [history, value]);

    React.useEffect(() => {
        setValue(location.pathname);
    }, [location])

    React.useEffect(() => {
        const elem = bottomNavRef.current;

        if (! elem) {
            return;
        }

        const onTransitioned = () => {
            if (isSidenavOpenRef.current) {
                elem.style.position = 'absolute';
            } else {
                elem.style.removeProperty('position');
            }
        };

        elem.addEventListener('transitionend', onTransitioned);

        return () => elem.removeEventListener('transitionend', onTransitioned);
    }, [bottomNavRef, isSidenavOpenRef]);


    if (location.pathname.startsWith('/doc/')) {
        // hack to disable when opening up docs.
        return null;
    }

    if (location.pathname.startsWith('/note/') || location.pathname.startsWith('/daily')) {
        // hack to disable when opening up docs.
        return null;
    }

    return (
        <Paper elevation={3}>
            <BottomNavigation value={value}
                              onChange={(_, newValue) => changeRoute(newValue)}
                              showLabels
                              ref={bottomNavRef}
                              className={classes.root}>

                {bottomNavLocations.map(current => (
                    <BottomNavigationAction key={current.id}
                                            disableRipple={true}
                                            disableTouchRipple={true}
                                            label={current.label}
                                            value={current.href}
                                            icon={current.icon}
                                            style={{
                                                // this is necessary for a workaround for MUI where items would shine
                                                // through the currently active action.
                                                backgroundColor: value === current.href ? theme.palette.primary.main :
                                                                                          theme.palette.background.paper
                                            }}
                    />
                ))}

            </BottomNavigation>
        </Paper>
    );
}
