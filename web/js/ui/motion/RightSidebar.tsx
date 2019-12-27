import * as React from "react";
import {Sidebar} from "./Sidebar";
import {motion} from "framer-motion";

export const RightSidebar = (props: IProps) => {

    const style: React.CSSProperties = {
        position: 'absolute',
        right: 0,
        top: 0,
        width: '350px',
        height: '100%',
        ...props.style || {},
    };

    // TODO: this isn't working either...exit just does NOT get called!

    return (
        <motion.div key="right-sidebar"
                    initial={{ right: -350 }}
                    animate={{ right: 0 }}
                    exit={{ right: -350 }}
                    style={style}>

            {props.children}
        </motion.div>
    );

};

interface IProps {
    readonly style?: React.CSSProperties;
    readonly children: React.ReactElement;
}
