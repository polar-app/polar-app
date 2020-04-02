import {motion} from "framer-motion";
import * as React from "react";

export const FadeIn = (props: any) => {

    return (
        <motion.div initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>

            {props.children}
        </motion.div>
    );

};

