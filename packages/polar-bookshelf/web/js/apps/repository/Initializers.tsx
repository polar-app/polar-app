import React from "react";
import {ZenModeDeactivateButton} from "../../mui/ZenModeDeactivateButton";
import {ZenModeGlobalHotKeys} from "../../mui/ZenModeGlobalHotKeys";
import {SideNavGlobalHotKeys} from "../../sidenav/SideNavGlobalHotKeys";
import {AnalyticsLocationListener} from "../../analytics/AnalyticsLocationListener";
import {AnkiSyncController} from "../../controller/AnkiSyncController";

export const Initializers: React.FC = () => (
    <>
        <AnkiSyncController />
        <AnalyticsLocationListener />
        
        {/* Keyboard shortcuts */}
        <ZenModeGlobalHotKeys />
        <SideNavGlobalHotKeys />
        <ZenModeDeactivateButton />
    </>
);
