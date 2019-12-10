import React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {ExportFormat} from '../../metadata/exporter/Exporters';
import {remote} from 'electron';
import {AppRuntime} from '../../AppRuntime';
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class ExportButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.doExport = this.doExport.bind(this);

    }

    public render() {

        return (
            <div>

                <UncontrolledDropdown direction="down"
                                      className="mt-auto mb-auto"
                                      size="md">

                    <DropdownToggle color="secondary" caret>

                        <i className="fas fa-file-export" style={{ marginRight: '5px' }}/>

                    </DropdownToggle>

                    <DropdownMenu className="shadow">
                        <DropdownItem header>Download annotations as:</DropdownItem>

                        <DropdownItem onClick={() => this.doExport('markdown')}>Markdown</DropdownItem>
                        <DropdownItem onClick={() => this.doExport('json')}>JSON</DropdownItem>
                    </DropdownMenu>

                </UncontrolledDropdown>

            </div>

        );

    }

    private doExport(format: ExportFormat) {

        this.props.onExport(format);

    }

}

interface IProps {
    readonly onExport: (format: ExportFormat) => void;
}

interface IState {
}

