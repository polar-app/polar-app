import {animated, useSpring} from "react-spring";
import * as React from "react";

export const SlideFromLeft = (props: React.HTMLAttributes<HTMLDivElement>) => {

    const spring = useSpring({
        opacity: 1,
        from: {
            transform: 'translateX(-100%)'
        },
        to: {
            transform: 'translateX(0%)'
        }
    });

    const style: React.CSSProperties = {
        ...props.style || {},
        ...spring
    };

    return <animated.div {...props} style={style}>
        {props.children}
    </animated.div>;

};
