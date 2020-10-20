import * as React from "react";
import {motion} from "framer-motion";

export const PageTransition = (props: IProps) => {

    const style = props.style || {};

    return (
        <motion.div initial={{
                        scale: 0.8,
                        opacity: 0.7
                    }}
                    animate={{
                        scale: 1.0,
                        opacity: 1.0
                    }}
                    exit={{
                    }}
                    style={style}>

            {props.children}
        </motion.div>
    );

};

interface IProps {
    readonly style?: React.CSSProperties;
    readonly children: React.ReactElement | React.ReactNode;
}
