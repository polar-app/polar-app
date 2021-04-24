import React from "react";
import {SideNavButtonWithAvatar} from "../../../web/js/sidenav/SideNavButtonWithAvatar";
import {VerticalDynamicScroller, VerticalDynamicScrollerProps} from "../../../web/js/sidenav/DynamicScroller";
import {TabDescriptor} from "../../../web/js/sidenav/SideNavStore";
import {Box, Button, createStyles, makeStyles, TextField} from "@material-ui/core";

const createTab = (name: string): TabDescriptor => ({
    id: name,
    url: name,
    type: 'pdf',
    title: name,
    created: 'date',
    activeURL: name,
    lastActivated: 'date2',
});

const useStyles = makeStyles(() => createStyles({
    fixedHeight: {
        height: 400
    },
    scrollerOutline: {
        border: '1px solid red',
    }
}));

const DynamicChild = () => {
    const [itemsCount, setItemsCount] = React.useState(5);
    return (
        <>
            <Button onClick={() => setItemsCount(count => count - 1)}>Remove</Button>
            <Button onClick={() => setItemsCount(count => count + 1)}>Add</Button>
            {Array.from({ length: itemsCount }).map((_, i) => <div key={i}>Item {i}</div>)}
        </>
    );
};

const ResizeEmulator: React.FC<VerticalDynamicScrollerProps> = ({ clickScrollAmount }) => {
    const classes = useStyles();
    const [height, setHeight] = React.useState(200);
    return (
        <>
            <Button onClick={() => setHeight(height => height - 20)}>Decrease</Button>
            <Button onClick={() => setHeight(height => height + 20)}>Increase</Button>
            <div>
                <VerticalDynamicScroller style={{ height }} className={classes.scrollerOutline} clickScrollAmount={clickScrollAmount}>
                    {Array.from({ length: 10 }).map((_, i) => <div key={i}>Item {i}</div>)}
                </VerticalDynamicScroller>
            </div>
        </>
    );
};

export const VerticalDynamicScrollerStory = () => {
    const classes = useStyles();
    const [clickScrollAmount, setClickScrollAmount] = React.useState(100);

    return (
        <div>
            <Box m={1}>
                <TextField
                    label="Arrow Scroll Amount (px)"
                    value={clickScrollAmount}
                    onChange={({ target: { value } }) => setClickScrollAmount(+value)}
                />
            </Box>
            <Box m={1} mt={5} style={{ display: 'flex' }}>
                <Box mr={10}>
                    <h5>Random children</h5>
                    <VerticalDynamicScroller
                        className={`${classes.scrollerOutline} ${classes.fixedHeight}`}
                        clickScrollAmount={clickScrollAmount}
                    >
                        <div>First</div>
                        <h1>Second</h1>
                        <div>Third</div>
                        <h1>Fourth</h1>
                        <div>Fifth</div>
                        <h1>Sixth</h1>
                        <div>Seventh</div>
                        <h1>Eighth</h1>
                        <div>Ninth</div>
                        <h1>Tenth</h1>
                    </VerticalDynamicScroller>
                </Box>
                <Box mr={10} className={classes.fixedHeight}>
                    <h5>Tabs</h5>
                    <VerticalDynamicScroller
                        className={`${classes.scrollerOutline} ${classes.fixedHeight}`}
                        clickScrollAmount={clickScrollAmount}
                    >
                        {
                            Array.from({ length: 100 })
                                .map((_, i) => createTab(`${i}-tab`))
                                .map(tab => <SideNavButtonWithAvatar key={tab.title} tab={tab} /> )
                        }
                    </VerticalDynamicScroller>
                </Box>
                <Box mr={10} className={classes.fixedHeight}>
                    <h5>Dyanamic Size Child</h5>
                    <VerticalDynamicScroller
                        className={`${classes.scrollerOutline} ${classes.fixedHeight}`}
                        clickScrollAmount={clickScrollAmount}
                    >
                        <DynamicChild />
                    </VerticalDynamicScroller>
                </Box>
                <Box mr={10}>
                    <h5>Container Resize</h5>
                    <ResizeEmulator {...{ clickScrollAmount }} />
                </Box>
            </Box>
        </div>
    );
};
