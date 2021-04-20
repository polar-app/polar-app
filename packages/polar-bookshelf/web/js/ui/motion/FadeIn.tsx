import {motion} from "framer-motion";
import * as React from "react";

interface IProps {
    readonly style?: React.CSSProperties;
    readonly children: React.ReactElement;
}

export const FadeIn = (props: IProps) => {

    return (
        <motion.div initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={props.style}
                    exit={{ opacity: 0 }}>

            {props.children}
        </motion.div>
    );

};

