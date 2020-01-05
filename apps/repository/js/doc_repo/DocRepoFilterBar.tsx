import * as React from 'react';
import {ToggleButton} from '../../../../web/js/ui/ToggleButton';
import {TagsDB} from '../TagsDB';
import {FilteredTags} from '../FilteredTags';
import InputGroup from 'reactstrap/lib/InputGroup';
import {SimpleTooltipEx} from '../../../../web/js/ui/tooltip/SimpleTooltipEx';
import {InputFilter} from "../../../../web/js/ui/input_filter/InputFilter";

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
                     display: 'flex',
                     marginLeft: 'auto',
                     justifyContent: 'flex-end'
                 }}>

                <div className="mr-2"
                     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                    <div className="checkbox-group">

                        <SimpleTooltipEx text="Only show flagged documents.">

                            <ToggleButton id="toggle-flagged"
                                          size="md"
                                          label="flagged"
                                          iconClassName="fas fa-flag"
                                          initialValue={false}
                                          onChange={value => this.props.onToggleFlaggedOnly(value)}/>

                        </SimpleTooltipEx>

                    </div>

                </div>

                <div className="header-filter-box mr-1"
                     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                    <div className="checkbox-group">

                        <SimpleTooltipEx text={`
                                           Show both archived and unarchived
                                           documents.  Archived documents are
                                           hidden by default.
                                         `}>

                            <ToggleButton id="toggle-archived"
                                          size="md"
                                          label="archived"
                                          iconClassName="fas fa-check"
                                          initialValue={false}
                                          onChange={value => this.props.onToggleFilterArchived(value)}/>

                        </SimpleTooltipEx>

                    </div>

                </div>

                <div className="header-filter-box mr-1 d-none-mobile"
                     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                    <div className="header-filter-box">

                        <SimpleTooltipEx text={`
                                            Filter the document list by the title of the document.
                                         `}>

                            <InputGroup size="md">

                                <InputFilter id="filter_title"
                                             placeholder="Filter by title"
                                             style={{
                                                 width: '20em'
                                             }}
                                             onChange={(value) => this.props.onFilterByTitle(value)}/>

                            </InputGroup>


                        </SimpleTooltipEx>

                    </div>

                </div>

                <Right/>

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
     * An index of the currently available tags.
     */
    readonly tagsDBProvider: () => TagsDB;

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
