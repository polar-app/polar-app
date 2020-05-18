import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Theme} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";


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
        textTransform: 'none',
        minHeight: '1.2em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flexGrow: 1
    }
}));

interface IState {

}

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
                    <Tab className={classes.tabs} label="Disney" {...a11yProps(0)} ></Tab>
                    <Divider/>
                    <Tab className={classes.tabs} label="Centers for Disease Control and Prevention" {...a11yProps(1)} />
                    <Divider/>
                    <Tab className={classes.tabs} label="Item Three" {...a11yProps(2)} />
                    <Divider/>
                    <Tab className={classes.tabs} label="Item Four" {...a11yProps(3)} />
                    <Divider/>
                    <Tab className={classes.tabs} label="Item Five" {...a11yProps(4)} />
                    <Divider/>
                    <Tab className={classes.tabs} label="Item Six" {...a11yProps(5)} />
                    <Divider/>
                    <Tab className={classes.tabs} label="Item Seven" {...a11yProps(6)} />
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
