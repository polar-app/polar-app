import {motion} from "framer-motion";
import * as React from "react";

// export const FadeIn = (props: any) => {
//
//     return (
//         <motion.div initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}>
//
//             {props.children}
//         </motion.div>
//     );
//
// };

export const FadeIn = (props: any) => {

    const pageVariants = {
        initial: {
            opacity: 0,
        },
        in: {
            opacity: 1,
        },
        out: {
            opacity: 0,
        }
    };

    return (
        <motion.div initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}>

            {props.children}
        </motion.div>
    );

};

