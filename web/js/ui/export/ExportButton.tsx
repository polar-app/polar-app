import React from 'react';
import {ExportFormat} from '../../metadata/exporter/Exporters';
import {MUIDropdownMenu} from "../../../spectron0/material-ui/dropdown_menu/MUIDropdownMenu";
import GetAppIcon from '@material-ui/icons/GetApp';
import {MUIDropdownItem} from "../../../spectron0/material-ui/dropdown_menu/MUIDropdownItem";

interface IProps {
    readonly onExport: (format: ExportFormat) => void;
}

export const ExportButton = (props: IProps) =>  {

    return (
        <MUIDropdownMenu button={{
                            icon: <GetAppIcon/>
                         }}>

            <div>
                <MUIDropdownItem text="Download as markdown"
                                 onClick={() => props.onExport('markdown')}/>

                <MUIDropdownItem text="Download as JSON"
                                 onClick={() => props.onExport('json')}/>
            </div>

        </MUIDropdownMenu>

    );

};
