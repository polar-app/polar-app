import * as React from 'react';
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {PolarSVGIcon} from "../../../../../web/js/ui/svg_icons/PolarSVGIcon";

export const MobileGatewayContent = deepMemo(function MobileGatewayContent() {

    return (
        <div>

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <PolarSVGIcon width={250} height={250}/>
            </div>

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <h1>Mobile Not Yet Supported</h1>
            </div>

            <h2 style={{textAlign: 'center'}}>
                We don't yet support mobile but we're working on it. Please check back soon!
            </h2>

        </div>
    );

});
