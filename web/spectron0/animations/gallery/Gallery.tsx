import React from "react";
import ReactDOM from "react-dom";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { images } from "./images";
import {FadeIn} from "../../../js/ui/motion/FadeIn";


// Get Framer Motion https://framer.com/motion

const transition = { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] };

const thumbnailVariants = {
    initial: { scale: 0.9, opacity: 0 },
    enter: { scale: 1, opacity: 1, transition },
    exit: {
        scale: 0.5,
        opacity: 0,
        transition: { duration: 1.5, ...transition }
    }
};

const frameVariants = {
    hover: { scale: 0.95 }
};

const imageVariants = {
    hover: { scale: 1.1 }
};

const Thumbnail = ({ id, i }: any) => (
    <motion.div className="thumbnail" variants={thumbnailVariants}>
        <motion.div
            className="frame"
            whileHover="hover"
            variants={frameVariants}
            transition={transition}
        >
            <Link to={`/image/${i}`}>
                <motion.img
                    src={`https://static1.squarespace.com/static/5b475b2c50a54f54f9b4e1dc/t/${id}.jpg?format=1500w`}
                    alt="The Barbican"
                    variants={imageVariants}
                    transition={transition}
                />
            </Link>
        </motion.div>
    </motion.div>
);

export const Gallery = () => (
    <>
        <h1>Barbican</h1>

        <p>
            This is the main gallery component
        </p>

        <div className="gallery">
            {/*<motion.div*/}
            {/*    className="thumbnails"*/}
            {/*    initial="initial"*/}
            {/*    animate="enter"*/}
            {/*    exit="exit"*/}
            {/*    variants={{ exit: { transition: { staggerChildren: 0.1 } } }}*/}
            {/*>*/}
            {/*    {images.map((id: any, i: any) => (*/}
            {/*        <Thumbnail key={id} id={id} i={i} />*/}
            {/*    ))}*/}
            {/*</motion.div>*/}

            <FadeIn>
                {images.map((id: any, i: any) => (
                    <Thumbnail key={id} id={id} i={i} />
                ))}
            </FadeIn>

        </div>
    </>
);
