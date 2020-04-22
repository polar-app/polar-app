import * as React from 'react';
import {FilteredTags} from '../FilteredTags';
import {MUIToggleButton} from "../../../../web/js/ui/MUIToggleButton";
import FlagIcon from '@material-ui/icons/Flag';
import Grid from "@material-ui/core/Grid";
import Tooltip from '@material-ui/core/Tooltip';
import {MUISearchBox2} from "../../../../web/spectron0/material-ui/MUISearchBox2";

export class DocRepoFilterBar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const Right = () => {

            if (this.props.right) {
                return this.props.right;
            } else {
                return <div/>;
            }

        };

        return (

            <div id="filter-bar"
                 style={{
                 }}>

                <Grid spacing={1}
                      container
                      direction="row"
                      justify="flex-start"
                      alignItems="center">

                    <Grid item>
                        <Tooltip title="Only show flagged items">
                            <MUIToggleButton id="toggle-flagged"
                                             size="small"
                                             label="flagged"
                                             icon={<FlagIcon/>}
                                             initialValue={false}
                                             onChange={value => this.props.onToggleFlaggedOnly(value)}/>
                        </Tooltip>
                    </Grid>

                    <Grid item>
                        <MUIToggleButton id="toggle-archived"
                                         size="small"
                                         label="archived"
                                         initialValue={false}
                                         onChange={value => this.props.onToggleFilterArchived(value)}/>
                    </Grid>

                    <Grid item>
                        <MUISearchBox2 id="filter_title"
                                       placeholder="Search by title"
                                       //    style={{
                                       //     width: '20em'
                                       // }}
                                       onChange={(value) => this.props.onFilterByTitle(value)}/>

                    </Grid>

                </Grid>

                {/*<div className="mr-2"*/}
                {/*     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>*/}

                {/*    <div className="checkbox-group">*/}

                {/*        <SimpleTooltipEx text="Only show flagged documents.">*/}

                {/*            <ToggleButton id="toggle-flagged"*/}
                {/*                          size="md"*/}
                {/*                          label="flagged"*/}
                {/*                          iconClassName="fas fa-flag"*/}
                {/*                          initialValue={false}*/}
                {/*                          onChange={value => this.props.onToggleFlaggedOnly(value)}/>*/}

                {/*        </SimpleTooltipEx>*/}

                {/*    </div>*/}

                {/*</div>*/}

                {/*<div className="header-filter-box mr-1"*/}
                {/*     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>*/}

                {/*    <div className="checkbox-group">*/}

                {/*        <SimpleTooltipEx text={`*/}
                {/*                           Show both archived and unarchived*/}
                {/*                           documents.  Archived documents are*/}
                {/*                           hidden by default.*/}
                {/*                         `}>*/}

                {/*            <ToggleButton id="toggle-archived"*/}
                {/*                          size="md"*/}
                {/*                          label="archived"*/}
                {/*                          iconClassName="fas fa-check"*/}
                {/*                          initialValue={false}*/}
                {/*                          onChange={value => this.props.onToggleFilterArchived(value)}/>*/}

                {/*        </SimpleTooltipEx>*/}

                {/*    </div>*/}

                {/*</div>*/}

                {/*<div className="header-filter-box mr-1 d-none-mobile"*/}
                {/*     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>*/}

                {/*    <div className="header-filter-box">*/}

                {/*        <SimpleTooltipEx text={`*/}
                {/*                            Filter the document list by the title of the document.*/}
                {/*                         `}>*/}

                {/*            <InputGroup size="md">*/}

                {/*                <InputFilter id="filter_title"*/}
                {/*                             placeholder="Search by title"*/}
                {/*                             style={{*/}
                {/*                                 width: '20em'*/}
                {/*                             }}*/}
                {/*                             onChange={(value) => this.props.onFilterByTitle(value)}/>*/}

                {/*            </InputGroup>*/}

                {/*        </SimpleTooltipEx>*/}

                {/*    </div>*/}

                {/*</div>*/}

                {/*<Right/>*/}

            </div>

        );

    }



}

export interface IProps {

    readonly docSidebarVisible: boolean;

    /**
     * Called when the flagged toggle is enabled/disabled
     */
    readonly onToggleFlaggedOnly: ToggleCallback;

    /**
     * Called when the archive toggle is enabled/disabled
     */
    readonly onToggleFilterArchived: ToggleCallback;

    /**
     * Called when the title is filtered with the current value of the title to
     * filter by.  When the title is "" then no filter is applied.
     */
    readonly onFilterByTitle: (title: string) => void;

    /**
     * A function to refresh the table when new results have been selected.
     */
    readonly refresher: () => void;

    readonly onDocSidebarVisible: (visible: boolean) => void;

    /**
     * A provider that can be updated with the filtered tags that are currently
     * being used.
     */
    readonly filteredTags: FilteredTags;

    /**
     * When defined, a JSX element to display on the right of the
     * FilterBar.
     */
    readonly right?: JSX.Element;

}

interface IState {

}

export type ToggleCallback = (value: boolean) => void;
