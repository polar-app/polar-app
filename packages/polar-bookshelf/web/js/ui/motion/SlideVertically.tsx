import * as React from "react";
import {motion} from "framer-motion";

export const SlideVertically = (props: IProps) => {

    const style: React.CSSProperties = {
        position: 'absolute',
        width: '100%',
        ...props.style || {},
    };

    return (
        <motion.div initial={{
                        opacity: 0.0,
                        transform: `translateY(${props.initialY}%)`
                    }}
                    animate={{
                        opacity: 1.0,
                        transform: `translateY(${props.targetY}%)`
                    }}
                    exit={{
                        opacity: 0.0,
                        transform: `translateY(${props.initialY}%)`
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
