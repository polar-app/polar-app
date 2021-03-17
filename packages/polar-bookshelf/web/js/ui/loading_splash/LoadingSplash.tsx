import * as React from 'react';
import {SplashBox} from "./SplashBox";
import {PolarSVGIcon} from "../svg_icons/PolarSVGIcon";

export function LoadingSplash() {

    return (
        <SplashBox>

            <div className="logo">
                <PolarSVGIcon width={250} height={250}/>
            </div>

        </SplashBox>
    );
}
