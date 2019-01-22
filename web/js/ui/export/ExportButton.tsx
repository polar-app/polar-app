import React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {Logger} from '../../logger/Logger';
import {ExportFormat} from '../../metadata/exporter/Exporters';
import {remote} from 'electron';

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
                                      size="sm">

                    <DropdownToggle color="primary" caret>

                        <i className="fas fa-file-export" style={{marginRight: '5px'}}></i>
                        Export
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem size="sm" onClick={() => this.doExport('markdown')}>Markdown</DropdownItem>
                        <DropdownItem size="sm" onClick={() => this.doExport('html')}>HTML</DropdownItem>
                        <DropdownItem size="sm" onClick={() => this.doExport('json')}>JSON</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>

            </div>

        );

    }

    private toExtension(format: ExportFormat) {

        switch (format) {
            case 'markdown':
                return 'md';
            case 'html':
                return 'html';
            case 'json':
                return 'json';
        }

    }

    private doExport(format: ExportFormat) {

        const ext = this.toExtension(format);

        const opts: Electron.SaveDialogOptions = {

            title: "Export to " + format,
            filters: [
                {extensions: [ext], name: format}
            ]

        };

        remote.dialog.showSaveDialog(opts, (path: string) => {

            if (path && this.props.onExport) {
                this.props.onExport(path, format);
            }

        });

    }

}

interface IProps {
    readonly onExport?: (path: string, format: ExportFormat) => void;
}

interface IState {
}

