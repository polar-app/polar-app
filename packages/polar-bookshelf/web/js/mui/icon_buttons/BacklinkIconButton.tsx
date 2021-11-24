import {SvgIcon} from "@material-ui/core";
import React from "react";

interface IProps {
    readonly className?: string;
    readonly style?: React.CSSProperties;
}

export const BacklinkIconButton: React.FC<IProps> = (props) => {
    const { className, style } = props;

    return (
        <SvgIcon className={className} style={style} viewBox="0 0 24 24">
            <path d="M6.0375 6.56797H5.03906V17.7266H6.0375V19.2944H3V5H6.0375V6.56797ZM10.1893 6.56797H9.19087V17.7266H10.1893V19.2944H7.15181V5H10.1893V6.56797ZM14.2813 5H17.3187V19.2944H14.2813V17.7266H15.2867V6.56797H14.2813V5ZM18.4331 5H21.4705V19.2944H18.4331V17.7266H19.4385V6.56797H18.4331V5Z" />
        </SvgIcon>
    );
};
