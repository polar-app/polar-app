import {animated, useSpring} from "react-spring";
import * as React from "react";

export const SlideFromBottom = (props: React.HTMLAttributes<HTMLDivElement>) => {

    const spring = useSpring({
        opacity: 1,
        from: {
            transform: 'translateY(100%)'
        },
        to: {
            transform: 'translateY(0%)'
        }
    });

    const style: React.CSSProperties = {
        ...props.style,
        ...spring
    };

    return <animated.div style={style}>
        {props.children}
    </animated.div>;

};

interface IProps {
    readonly render: (style: React.CSSProperties) => React.ReactElement;
}
