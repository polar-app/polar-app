import React from "react";

export namespace ContextMenus {

    export function withContextMenu<P extends React.HTMLAttributes<HTMLDivElement>>(WrappedComponent: React.ComponentType<P>) {

        return (props: P) => {

            const [active, setActive] = React.useState(false);

            const onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
                console.log("FIXME: onContextMenu");
                setActive(true);
            };

            return (
                <>
                    <WrappedComponent {...props}
                                      onContextMenu={(event) => onContextMenu(event)} />

                    {active && <div>we are active</div>}
                </>
            );
        }

    }

}
