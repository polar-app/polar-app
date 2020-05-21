import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import makeStyles from '@material-ui/core/styles/makeStyles';
import {darken, lighten, Theme} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import isEqual from "react-fast-compare";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    const display = value === index ? 'flex' : 'none';

    return (
        <div role="tabpanel"
             style={{
                 flexGrow: 1,
                 display
             }}
             id={`scrollable-auto-tabpanel-${index}`}
             aria-labelledby={`scrollable-auto-tab-${index}`}
             {...other}>

            {children}

        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    tabs: {
        paddingTop: '2px',
        textTransform: 'none',
        minHeight: '1.2em',
        flexShrink: 1,
        flexGrow: 1,
        "& button + button span:first-child": {
            borderLeft: '1px solid ' + theme.palette.divider,
        },
    },
    tab: {

        color: theme.palette.text.secondary,

        // padding: '5px 0 5px 5px',
        padding: 0,
        textTransform: 'none',
        minHeight: '1.2em',
        flex: '1 1 0',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minWidth: 0,
        // we must overflow to allow the wrapper to have overflow hidden
        // so we get text elipsis
        overflow: 'auto',
        overflowX: 'auto',
        overflowY: 'auto',

        '&:hover': {
            backgroundColor: theme.palette.background.default,
        },

        '&$selected, &$selected:hover': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
        },

        '&$selected, &:hover': {
            // borderRadius: '8px 8px 0px 0px',
        },

        "&$selected span:first-child, &:hover span:first-child": {
            // disable the left border of the next item.
            borderLeft: '1px solid transparent',
        },
        "&$selected + button span:first-child, &:hover + button span:first-child": {
            // disable the left border of the next item.
            borderLeft: '1px solid transparent',
        },

    },
    wrapper: {

        marginTop: '5px',
        marginBottom: '5px',
        paddingLeft: '10px',

        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        textAlign: 'left',

        whiteSpace: 'nowrap',
        overflow: 'hidden',
        // textOverflow: 'ellipsis',
        "webkit-mask-image": "linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent)",
        maskImage: "linear-gradient(90deg, #000 0%, #000 calc(100% - 24px), transparent)",

    },
    selected: {},

}));

interface BrowserTabProps {
    readonly label: React.ReactNode;
    readonly value: number;
    readonly selected?: boolean;
    readonly onChange?: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const BrowserTab = React.memo((props: BrowserTabProps) => {

    const classes = useStyles();

    // FIXME: minWidth here will allow them to collaps but the UI looks like crap
    // when we do this.

    // FIXME: selected is totally broken/ weird here... it seems I have to pass in 'selected'
     // prop but then it actually doesn't matter which one is selected as it
    // picks its own value...
    //
    // FIXME: the idea around fixing the bug in is to use a border but disable
    // it when teh active items is bein gselected.  this way the borders
    // look right.

    // we can ALSO use a border-radio at the top and right ... and change
    // the background color of the 'selected' item.

    return (
        <Tab className={classes.tab}
             classes={{
                 wrapper: classes.wrapper,
                 selected: props.selected ? classes.selected : undefined
             }}
             // label={<TabbedBrowserLabel label={props.label}/>}
             label={props.label}
             selected
             {...a11yProps(props.value)}
             value={props.value}
             onChange={props.onChange}/>
    );

}, isEqual);

export const TabbedBrowserDemo = () => {

    const [value, setValue] = React.useState(0);

    const classes = useStyles();

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
            <AppBar position="static" color="default">
                <Tabs
                    className={classes.tabs}
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example">

                    <BrowserTab label="Disney" value={0} selected={value === 0}/>
                    <BrowserTab label="Hello world" value={1} selected={value === 1}/>
                    <BrowserTab label="Centers for Disease Control and Prevention" value={2} selected={value === 2} />
                    <BrowserTab label="Tab 4" value={3} selected={value === 3}/>
                    <BrowserTab label="Tab 5" value={4} selected={value === 4}/>
                    <BrowserTab label="Tab 6" value={5} selected={value === 5}/>
                    <BrowserTab label="Tab 7" value={6} selected={value === 6}/>
                    <BrowserTab label="Tab 8" value={7} selected={value === 7}/>
                    <BrowserTab label="Tab 9" value={8} selected={value === 8}/>

                </Tabs>
            </AppBar>

            <Divider/>

            <TabPanel value={value} index={0}>
                <iframe src="https://www.disney.com" frameBorder="0" style={{flexGrow: 1}}/>
            </TabPanel>

            <TabPanel value={value} index={1}>
                <iframe src="https://www.stackoverflow.com" frameBorder="0" style={{flexGrow: 1}}/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <iframe src="https://www.cdc.gov" frameBorder="0" style={{flexGrow: 1}}/>
            </TabPanel>
            <TabPanel value={value} index={3}>
                Item Four
            </TabPanel>
            <TabPanel value={value} index={4}>
                Item Five
            </TabPanel>
            <TabPanel value={value} index={5}>
                Item Six
            </TabPanel>
            <TabPanel value={value} index={6}>
                Item Seven
            </TabPanel>
        </div>
    );
}
