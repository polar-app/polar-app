import * as React from "react";
import {motion} from "framer-motion";

export const Sidebar = (props: IProps) => {

    const style: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        width: '350px',
        height: '100%',
        ...props.style || {},
    };

    return (
        <motion.div initial={{ transform: `translateX(${props.initialX}%)` }}
                    animate={{ transform: `translateX(${props.targetX}%)` }}
                    exit={{ transform: `translateX(${props.initialX}%)` }}
                    style={style}>

            {props.children}
        </motion.div>
    );

};

interface IProps {
    readonly initialX: number;
    readonly targetX: number;
    readonly style?: React.CSSProperties;
    readonly children: React.ReactElement;
}
