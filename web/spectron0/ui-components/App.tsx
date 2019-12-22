import * as React from 'react';
import {Tags} from 'polar-shared/src/tags/Tags';
import {Group} from "../../js/datastore/sharing/db/Groups";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {TasksCalculator} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Lorems} from "polar-shared/src/util/Lorems";
import {Task} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {FontAwesomeIcon} from "../../js/ui/fontawesome/FontAwesomeIcon";
import {Link} from "react-router-dom";
import {Lightbox} from "../../js/ui/util/Lightbox";
import {Dialogs} from "../../js/ui/dialogs/Dialogs";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {ActionButton} from "../../js/ui/mobile/ActionButton";
import {
    HolidayPromotionButton,
    HolidayPromotionCopy
} from "../../../apps/repository/js/repo_header/HolidayPromotionButton";
import {AccountControlBar} from "../../js/ui/cloud_auth/AccountControlBar";
import {UserInfo} from "../../js/apps/repository/auth_handler/AuthHandler";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {ReactRouters} from "../../js/ui/ReactRouters";
import {AccountOverview} from "../../../apps/repository/js/account_overview/AccountOverview";
import milliseconds from "mocha/lib/ms";
import {DockLayout, DockPanel} from "../../js/ui/doc_layout/DockLayout";

const styles = {
    swatch: {
        width: '30px',
        height: '30px',
        float: 'left',
        borderRadius: '4px',
        margin: '0 6px 6px 0',
    }
};

const Folders = () => {
    return <div style={{backgroundColor: 'red', overflow: 'auto'}}>
        these are the folders
    </div>;
};

const Preview = () => {
    return <div style={{backgroundColor: 'orange', overflow: 'auto'}}>
        This is the preview
    </div>;
};


const Main = () => {
    return <div style={{backgroundColor: 'blue'}}>this is the right</div>;
};

export class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

    }

    public render() {

        const dockPanels: ReadonlyArray<DockPanel> = [
            {
                id: "left-sidebar",
                type: 'fixed',
                component: <div>left</div>,
                width: 350
            },
            {
                id: "main",
                type: 'grow',
                component: <div>main</div>,
                grow: 1
            },
            {
                id: "right-sidebar",
                type: 'fixed',
                component: <div>right</div>,
                width: 350
            }

        ];

        return (
            <DockLayout dockPanels={dockPanels}/>
        );
    }


}

interface IAppState {

}


