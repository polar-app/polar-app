import {motion} from "framer-motion";
import * as React from "react";

export const ScaleAndFadeIn = (props: any) => {

    return (
        <motion.div initial={{
                        opacity: 0,
                        // transform: 'scale(0.8)'
                    }}
                    animate={{
                        opacity: 1,
                        // transform: 'scale(1.0)'
                    }}
                    exit={{
                        opacity: 0,
                        // transform: 'scale(0.8)'
                    }}>

            {props.children}
        </motion.div>
    );

};

