import * as React from "react";
import {BlackoutCurtain} from "../../../../web/js/ui/BlackoutCurtain";
import {Devices} from "polar-shared/src/util/Devices";

interface IProps {
    readonly className?: string;
    readonly children: any;
}

export const ReviewerModal = (props: IProps) => {

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

    const className = "ml-auto mr-auto h-100 border p-1 " + (props.className || '');

    return (
        <BlackoutCurtain>
            <div style={style}
                 className={className}>
                {props.children}
            </div>
        </BlackoutCurtain>
    );

};
