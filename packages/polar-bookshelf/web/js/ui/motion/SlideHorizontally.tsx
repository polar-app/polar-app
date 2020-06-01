import * as React from "react";
import {motion} from "framer-motion";

export const SlideHorizontally = (props: IProps) => {

    const style: React.CSSProperties = {
        ...props.style || {},
    };

    return (
        <motion.div initial={{
                        transform: `translateX(${props.initialY}%)`
                    }}
                    animate={{
                        transform: `translateX(${props.targetY}%)`
                    }}
                    exit={{
                        transform: `translateX(${props.initialY}%)`
                    }}
                    // transition={{
                    //     ease: "linear"
                    // }}
                    style={style}>

            {props.children}
        </motion.div>
    );

};

interface IProps {
    readonly initialY: number;
    readonly targetY: number;
    readonly style?: React.CSSProperties;
    readonly children: React.ReactElement | React.ReactNode;
}
