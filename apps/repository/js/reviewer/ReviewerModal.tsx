import * as React from "react";
import {Devices} from "../../../../web/js/util/Devices";
import {BlackoutCurtain} from "../../../../web/js/ui/BlackoutCurtain";

export const ReviewerModal = (props: any) => {

    const createStyle = () => {

        // again, hard, good, easy

        const style: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--primary-background-color)',
        };

        if (['phone', 'tablet'].includes(Devices.get())) {
            style.width = '100%';
            style.height = '100%';
        } else {
            style.maxHeight = '1000px';
            style.width = '800px';
            style.maxWidth = '800px';
        }

        return style;

    };

    const style = createStyle();

    return (
        <BlackoutCurtain>
            <div style={style}
                 className="ml-auto mr-auto h-100 border p-1 text-md">
                {props.children}
            </div>
        </BlackoutCurtain>
    );

};
