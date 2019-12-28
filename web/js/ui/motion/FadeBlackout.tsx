import * as React from "react";
import {motion} from "framer-motion";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IProps {
    readonly style?: React.CSSProperties;
    readonly onClick?: () => void;
}

export const FadeBlackout = (props: IProps) => {

    const style: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(0, 0, 0)',
        ...(props.style || {})
    };

    const onClick = props.onClick || NULL_FUNCTION;

    return (

        <motion.div initial={{ opacity: 0.0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0 }}
                    style={style}
                    onClick={() => onClick()}>
        </motion.div>

    );

};
