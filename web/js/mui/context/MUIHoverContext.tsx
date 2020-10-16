import React from "react";
import {Devices} from "polar-shared/src/util/Devices";

export const MUIHoverTypeContext = React.createContext<boolean>(false);

interface IProps {
    readonly children: JSX.Element;
}

export const MUIHoverController = (props: IProps) => {

    const [active, setActive] = React.useState(false);

    const device = Devices.get();

    if (device !== "desktop") {
        // only on desktop should this work because there is really no hover
        // state on phone/table
        return props.children;
    }

    const handleToggleActive = (newActive: boolean) => {
        setActive(newActive);
    };

    return (
        <div onMouseEnter={() => handleToggleActive(true)}
             onMouseLeave={() => handleToggleActive(false)}>

            <MUIHoverTypeContext.Provider value={active}>
                {props.children}
            </MUIHoverTypeContext.Provider>

        </div>
    );

};

interface MUIHoverListenerProps {
    readonly id?: string;
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly children: JSX.Element;
}

/**
 * Only renders when the parent context component is active.
 */
export const MUIHoverListener = (props: MUIHoverListenerProps) => (
    <MUIHoverTypeContext.Consumer>
        {
            (active) => active && props.children
        }
    </MUIHoverTypeContext.Consumer>
);
