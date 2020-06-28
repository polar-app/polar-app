import * as React from 'react';
import {SplashBox} from "./SplashBox";
import {PolarSVGIcon} from "../svg_icons/PolarSVGIcon";

export function LoadingSplash() {

    return (
        <SplashBox>

            <div className="logo" style={{width: 250, height: 250}}>
                <PolarSVGIcon/>
            </div>

        </SplashBox>
    );
}
