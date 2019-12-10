import * as React from 'react';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import {UncontrolledDropdown} from "reactstrap";
import {Exporters, ExportFormat} from "../../../../web/js/metadata/exporter/Exporters";
import {Logger} from "polar-shared/src/logger/Logger";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";

const log = Logger.create();

export class AnnotationRepoTableDropdown extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps>) {
        super(props);
        this.onExport = this.onExport.bind(this);
    }

    public render() {

        return (

            <div className="text-right">

                <UncontrolledDropdown size="md">

                    <DropdownToggle color="light"
                                    size="md"
                                    className="table-dropdown-button btn text-muted p-1 m-0">

                        <i className="fas fa-ellipsis-h"/>

                    </DropdownToggle>

                    <DropdownMenu className="shadow" right>

                        <DropdownItem header>Download annotations as:</DropdownItem>

                        <DropdownItem onClick={() => this.onExport('markdown')}>
                            Markdown
                        </DropdownItem>

                        <DropdownItem onClick={() => this.onExport('json')}>
                            JSON
                        </DropdownItem>

                    </DropdownMenu>


                </UncontrolledDropdown>

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
