import React from "react";

interface IProps {
    readonly children: JSX.Element;
}

export const ParentSizedContainer = React.memo((props: IProps) => {

    const [height, setHeight] = React.useState(0);
    const [width, setWidth] = React.useState(0);

    const handleElement = React.useCallback((element: HTMLElement | null) => {
        if (element?.parentElement) {
            setHeight(element.parentElement.clientHeight);
            setWidth(element.parentElement.clientWidth);
        }
    }, []);

    return (
        <div className="ParentSizedContainer" ref={handleElement} style={{height, width}}>
            {height > 0 && width > 0 && props.children}
        </div>
    );

});
