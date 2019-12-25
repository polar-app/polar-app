import {animated, useSpring} from "react-spring";
import * as React from "react";

export const FadeIn = (props: any) => {

    const spring = useSpring({
        opacity: 1.0,
        from: {
            opacity: 0.0
        },
        to: {
            opacity: 1.0
        }
    });

    const style: React.CSSProperties = {
        ...props.style || {},
        ...spring
    };

    return <animated.div style={style}>
        {props.children}
    </animated.div>;

};

interface IProps {
    readonly style?: React.CSSProperties;
    readonly children: React.ReactElement;
}

