import {animated, useSpring} from "react-spring";
import * as React from "react";
import {useState} from "react";

export const LeftSidebar = (props: IProps) => {

    const spring = useSpring({
        from: {
            transform: 'translateX(-100%)'
        },
        to: {
            transform: 'translateX(0%)'
        }
    });

    const style: React.CSSProperties = {
        ...props.style || {},
        position: 'absolute',
        left: 0,
        top: 0,
        width: '350px',
        height: '100%',
        ...spring,
    };

    return <animated.div style={style}>
        {props.children}
    </animated.div>;

};


export class LeftSidebars {

    public static create(props: IProps) {

        const [enabled, toggleSidebar] = useState(false);

        const spring = useSpring({
            from: {
                transform: 'translateX(-100%)'
            },
            to: {
                transform: 'translateX(0%)'
            }
        });

        const display = enabled ? 'block' : 'none';

        const style: React.CSSProperties = {
            ...props.style || {},
            display,
            position: 'absolute',
            left: 0,
            top: 0,
            width: '350px',
            height: '100%',
            ...spring,
        };

        const sidebar = (
            <animated.div style={style}>
                {props.children}
            </animated.div>
        );

        return [sidebar, toggleSidebar];

    }

}

interface IProps {
    readonly style?: React.CSSProperties;
    readonly children: React.ReactElement;
}
