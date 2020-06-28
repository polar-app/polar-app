import * as React from 'react';

import RESOURCE from 'polar-assets/src/assets/logo/icon.svg';

interface IProps {
    readonly className?: string;
    readonly width?: number | string;
    readonly height?: number | string;
}

export const PolarSVGIcon = React.memo((props: IProps) => (
    <img src={RESOURCE} alt="Polar Logo" {...props}/>
));


