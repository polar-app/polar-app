import * as React from "react";
import {motion} from "framer-motion";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IProps {
    readonly style?: React.CSSProperties;
    readonly onClick?: () => void;
}

export const FadeBlackout = (props: IProps) => {

    const positioning: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        ...(props.style || {})
    };

    const style: React.CSSProperties = {
        backgroundColor: 'rgba(0, 0, 0)',
        ...positioning,
        ...(props.style || {})
    };

    const onClick = props.onClick || NULL_FUNCTION;

    // TODO: move this blurry background filter to a dedicated component

    return (
        <>
            <div style={{
                     ...positioning,
                    backdropFilter: 'blur(5px)',
                }}>

            </div>
            <motion.div initial={{
                            opacity: 0.0
                        }}
                        animate={{
                            opacity: 0.7
                        }}
                        exit={{
                            opacity: 0
                        }}
                        style={style}
                        onClick={() => onClick()}>
            </motion.div>
        </>

    );

};
