import * as React from 'react';

interface IProps {
    readonly Active: React.FunctionComponent;
    readonly Inactive: React.FunctionComponent;
    readonly className?: string;
    readonly style?: React.CSSProperties;
}

export const MUIHoverToggle = React.memo(function MUIHoverToggle(props: IProps) {

    const [hover, setHover] = React.useState(false);

    const {Active, Inactive} = props;

    return (
        <div onMouseEnter={() => setHover(true)}
             onMouseLeave={() => setHover(false)}>

            {hover && <Active/>}
            {! hover && <Inactive/>}

        </div>
    );

});

