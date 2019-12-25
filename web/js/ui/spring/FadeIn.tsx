import {animated, useSpring} from "react-spring";
import * as React from "react";

export const FadeIn = (props: React.HTMLAttributes<HTMLDivElement>) => {

    const spring = useSpring({
        from: {
            opacity: 0.0
        },
        to: {
            opacity: 1.0
        },
        enter: {
            opacity: 1.0
        },
        leave: {
            opacity: 0.0
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
