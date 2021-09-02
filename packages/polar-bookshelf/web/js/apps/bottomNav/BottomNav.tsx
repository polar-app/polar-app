import { createStyles, makeStyles } from "@material-ui/core/styles";
import { observer } from "mobx-react-lite";
import * as React from 'react';
import ReactDOM from 'react-dom';
import { useHistory, useLocation } from "react-router-dom";
import { RoutePathnames } from "../../apps/repository/RoutePathnames";
// import {DeviceRouter} from '../ui/DeviceRouter';
import {URLPathStr} from 'polar-shared/src/url/PathToRegexps';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';
import HomeIcon from '@material-ui/icons/Home';
import { ActiveTabButton } from "../../sidenav/ActiveTabButton";
import { SwitchToOpenDocumentKeyboardCommand } from "polar-bookshelf/web/js/sidenav/SwitchToOpenDocumentKeyboardCommand";


const NAVBAR_HEIGHT = '66px';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            height: NAVBAR_HEIGHT,
            width: '100%',
        },
        tab:{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#979797',
            backgroundColor: 'transparent',
            border: 'none'
        },
        active:{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            backgroundColor: '#6754D6',
            border: 'none'
        }
    })
);


interface HistoryButtonProps {
    readonly path: string;
    readonly onClick?: React.MouseEventHandler<HTMLElement>;
    readonly title: string;
    readonly children: JSX.Element | string;
    readonly canonicalizer?: (path: URLPathStr) => URLPathStr;
}

const HomeButton = React.memo(function HomeButton(props: HistoryButtonProps) {

    const history = useHistory();
    const classes = useStyles();

    return (
        <ActiveTabButton title="Documents"
                         path={RoutePathnames.HOME}
                         noContextMenu={true}
                         onClick={() => history.push(RoutePathnames.HOME)}>
                             {props.children}
        </ActiveTabButton>
    )
});

function HistoryButtonProps(arg0: (theme: import("@material-ui/core/styles").Theme) => import("@material-ui/styles").StyleRules<{}, "root">, HistoryButtonProps: any, arg3: { readonly path: any; readonly onClick: any; readonly title: any; readonly children: number; }) {
    throw new Error("Function not implemented.");
}

export const NavHistoryButton = React.memo(function NavHistoryButton(props: HistoryButtonProps) {

    const {path, title, children, onClick, canonicalizer} = props;
    const history = useHistory();

    const handleClick = React.useCallback((e) => {
        if (onClick) {
            onClick(e);
        } else {
            history.push(path);
        }
    }, [history, onClick, path]);

    return (
        <ActiveTabButton title={title}
                         path={path}
                         canonicalizer={canonicalizer}
                         noContextMenu={true}
                         onClick={handleClick}>
            {children}
        </ActiveTabButton>
    )
});

export const BottomNav = React.memo(function BottomNav() {

    // const { tabs } = useSideNavStore(['tabs', 'isOpen']);
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    console.log(location)

    const onHome = () =>{
        history.push(RoutePathnames.HOME);
    }
    const onAdd = () =>{
        history.push({hash: "#add"});
    }
    const onSearch = () => {
    }
    const onSwitch = () => {
        // SwitchToOpenDocumentKeyboardCommand();
    }
    return (
        <div className={classes.root}>
            <button className={`${location.pathname === RoutePathnames.HOME ? classes.active : classes.tab}`}  onClick={() => onHome()}>
                <HomeIcon/>
                <span>Home</span>    
            </button> 
            <button className={`${location.pathname === 'search' ? classes.active : classes.tab}`} onClick={() => onSearch()}>
                <SearchIcon/>
                <span>Search</span>
            </button> 
            <button className={`${location.hash === '#add' ? classes.active : classes.tab}`} onClick={() => onAdd()}>
                <AddIcon />
                <span>Add</span>
            </button> 
            <button className={`${location.pathname === 'switch' ? classes.active : classes.tab}`}  onClick={() => onSwitch()}>
                <ViewCarouselIcon/>
                <span>Switch</span>
            </button> 
        </div>
    )});