import React from 'react';
import {ExportFormat} from '../../metadata/exporter/Exporters';
import {MUIMenu} from "../../../spectron0/material-ui/dropdown_menu/MUIMenu";
import GetAppIcon from '@material-ui/icons/GetApp';
import {MUIMenuItem} from "../../../spectron0/material-ui/dropdown_menu/MUIMenuItem";

interface IProps {
    readonly onExport: (format: ExportFormat) => void;
}

export const ExportButton = (props: IProps) =>  {

    return (
        <MUIMenu button={{
                            icon: <GetAppIcon/>
                         }}>

            <div>
                <MUIMenuItem text="Download as markdown"
                             onClick={() => props.onExport('markdown')}/>

                <MUIMenuItem text="Download as JSON"
                             onClick={() => props.onExport('json')}/>
            </div>

        </MUIMenu>

    );

};
