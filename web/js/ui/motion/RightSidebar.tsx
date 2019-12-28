import * as React from "react";
import {motion} from "framer-motion";
import {Button} from "reactstrap";

const zIndex = 3000000;

export const RightSidebar = (props: IProps) => {

    const computeWidth = () => {
        return props.fullscreen ? window.screen.width : (props.width || 350);
    };

    const width = computeWidth();

    const style: React.CSSProperties = {
        position: 'absolute',
        right: 0,
        top: 0,
        width: `${width}px`,
        height: '100%',
        backgroundColor: 'var(--primary-background-color)',
        color: 'var(--primary-text-color)',
        zIndex,
        ...props.style || {},
    };

    // TODO: this isn't working either...exit just does NOT get called!

    const inactiveWidth = -1 * width;

    return (
        <>
            <div className="right-sidebar-blackout"
                 style={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     zIndex: zIndex - 1,
                     width: '100%',
                     height: '100%',
                     backgroundColor: 'rgba(0, 0, 0, 0.7)',
                 }}
                 onClick={() => props.onClose()}>

            </div>

            <motion.div className="right-sidebar border-left"
                        initial={{ right: inactiveWidth }}
                        animate={{ right: 0 }}
                        exit={{ right: inactiveWidth }}
                        style={style}>

                <div className="text-right pr-1">

                    <Button size="lg"
                            color="clear"
                            className="btn-no-outline text-xl text-muted"
                            onClick={() => props.onClose()}>

                        <i className="fas fa-times"/>

                    </Button>

                </div>


                {props.children}

            </motion.div>
        </>
    );

};

interface IProps {
    readonly width?: number;
    readonly style?: React.CSSProperties;
    readonly fullscreen?: boolean;
    readonly children: React.ReactElement;
    readonly onClose: () => void;
}
