import * as React from 'react';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import {UncontrolledDropdown} from "reactstrap";
import {Exporters, ExportFormat} from "../../../../web/js/metadata/exporter/Exporters";
import {Logger} from "polar-shared/src/logger/Logger";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {Devices} from "polar-shared/src/util/Devices";
import {MUIDropdownMenu} from "../../../../web/spectron0/material-ui/dropdown_menu/MUIDropdownMenu";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {MUIDropdownItem} from "../../../../web/spectron0/material-ui/dropdown_menu/MUIDropdownItem";
const log = Logger.create();

export class AnnotationRepoTableDropdown extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps>) {
        super(props);
        this.onExport = this.onExport.bind(this);
    }

    public render() {

        if (! Devices.isDesktop()) {
            return null;
        }

        return (

            <div>

                <MUIDropdownMenu caret
                                 placement="bottom-end"
                                 button={{
                                    icon: <MoreVertIcon/>,
                                    size: 'small'
                                 }}>

                    <div>
                        <MUIDropdownItem text="Download as Markdown"
                                         onClick={() => this.onExport('markdown')}/>

                        <MUIDropdownItem text="Download as JSON"
                                         onClick={() => this.onExport('json')}/>
                    </div>

                </MUIDropdownMenu>

            </div>
        );

    }

    private onExport(format: ExportFormat) {
        Exporters.doExportForAnnotations(this.props.persistenceLayerProvider,  this.props.annotations, format)
            .catch(err => log.error("Unable to download: ", err));
    }

}

interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly annotations: ReadonlyArray<IDocAnnotation>;
}

interface IState {

}
