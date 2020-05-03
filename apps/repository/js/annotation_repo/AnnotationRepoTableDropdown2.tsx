import * as React from 'react';
import {ExportFormat} from "../../../../web/js/metadata/exporter/Exporters";
import {Logger} from "polar-shared/src/logger/Logger";
import {Devices} from "polar-shared/src/util/Devices";
import {MUIMenu} from "../../../../web/spectron0/material-ui/dropdown_menu/MUIMenu";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {MUIMenuItem} from "../../../../web/spectron0/material-ui/dropdown_menu/MUIMenuItem";

const log = Logger.create();

interface IProps {
    readonly onExport: (format: ExportFormat) => void;
}


export class AnnotationRepoTableDropdown2 extends React.Component<IProps> {

    public render() {

        if (! Devices.isDesktop()) {
            return null;
        }

        return (

            <div>

                <MUIMenu caret
                         placement="bottom-end"
                         button={{
                                    icon: <MoreVertIcon/>,
                                    size: 'small'
                                 }}>

                    <div>
                        <MUIMenuItem text="Download as Markdown"
                                     onClick={() => this.props.onExport('markdown')}/>

                        <MUIMenuItem text="Download as JSON"
                                     onClick={() => this.props.onExport('json')}/>
                    </div>

                </MUIMenu>

            </div>
        );

    }


}
