import {motion} from "framer-motion";
import * as React from "react";

export const Pulse = (props: any) => {

    return (
        <motion.div initial={{
                        scale: 0.9,
                        opacity: 0.9
                    }}
                    animate={{
                        scale: 1.0,
                        opacity: 1.0
                    }}
                    exit={{ scale: 0 }}
                    transition={{
                        duration: 1.8,
                        loop: Infinity
                    }}>

            {props.children}
        </motion.div>
    );

};

