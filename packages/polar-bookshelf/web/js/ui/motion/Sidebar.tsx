import * as React from "react";
import {motion} from "framer-motion";
import {FadeBlackout} from "./FadeBlackout";

const zIndex = 3000000;

export const Sidebar = (props: IProps) => {

    const computeWidth = () => {
        return props.fullscreen ? window.screen.width : (props.width || 350);
    };

    const width = computeWidth();

    const style: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        width: `${width}px`,
        height: '100%',
        backgroundColor: 'var(--primary-background-color)',
        color: 'var(--primary-text-color)',
        zIndex,
        ...props.style || {},
    };

    const inactiveWidth = 1 * (width * 0.7);

    return (
        <>

            <FadeBlackout style={{zIndex: zIndex - 1}} onClick={() => props.onClose()}/>

            <motion.div className={`right-sidebar ${props.borderBarClassName}`}
                        initial={{
                            opacity: 0.0,
                            right: inactiveWidth
                        }}
                        animate={{
                            opacity: 1.0,
                            right: 0
                        }}
                        exit={{
                            opacity: 0.0,
                            right: inactiveWidth
                        }}
                        style={style}>

                {/*<div className={`${props.buttonBarClassName} pr-1`}>*/}

                {/*    <Button size="lg"*/}
                {/*            color="clear"*/}
                {/*            className="btn-no-outline text-xl text-muted"*/}
                {/*            onClick={() => props.onClose()}>*/}

                {/*        <i className="fas fa-times"/>*/}

                {/*    </Button>*/}

                {/*</div>*/}

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

    readonly buttonBarClassName: string;
    readonly borderBarClassName: string;

}
