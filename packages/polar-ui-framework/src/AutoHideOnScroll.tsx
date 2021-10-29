import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import React from 'react';
import {AppBar, Fab, Toolbar, Zoom} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/Add";

interface Props {

    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    readonly target?: Window | Node
    readonly children: React.ReactElement;

}

function HideOnScrollUsingSlide(props: Props) {

    const { children, target } = props;

    const trigger = useScrollTrigger({
        target: props.target,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );

}

function HideOnScrollUsingZoom(props: Props) {

    const { children, target } = props;

    const trigger = useScrollTrigger({
        target: props.target,
    });

    return (
        <Zoom appear={false} in={!trigger}>
            {children}
        </Zoom>
    );

}

interface AutoHidePageLayoutProps {
    readonly title: string;
    readonly children: JSX.Element;
}

export const AutoHidePageLayout = (props: AutoHidePageLayoutProps) => {

    const [scrollElement, setScrollElementState] = React.useState<HTMLDivElement | null>(null)

    return (

        <div className="AdaptivePageLayout"
             style={{
                 display: 'flex',
                 flexDirection: 'column',
                 flexGrow: 1,
                 minWidth: 0,
                 minHeight: 0,
             }}>

            {/*<DeviceRouter.Handheld>*/}
                <>
                    <HideOnScrollUsingSlide target={scrollElement || undefined}>
                        <AppBar>
                            <Toolbar>

                                <IconButton>
                                    <ArrowBackIcon/>
                                </IconButton>

                                {props.title}

                            </Toolbar>
                        </AppBar>

                    </HideOnScrollUsingSlide>

                </>

            {/*</DeviceRouter.Handheld>*/}

            <Toolbar/>

            <div style={{
                display: 'flex',
                flexGrow: 1,
                minHeight: 0,
                minWidth: 0,
            }}
            >


                <div style={{
                         overflow: 'auto',
                         flexGrow: 1
                     }}
                     ref={ref => setScrollElementState(ref)}>

                    <div
                        style={{
                            maxWidth: '700px',
                        }}
                    >

                        {props.children}

                    </div>

                </div>

            </div>

            <HideOnScrollUsingZoom target={scrollElement || undefined}>
                <Fab color="primary" aria-label="add"
                     style={{
                         position: 'absolute',
                         right: '16px',
                         bottom: '16px'
                     }}>
                    <AddIcon />
                </Fab>
            </HideOnScrollUsingZoom>

        </div>

    );

}

