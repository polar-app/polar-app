import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {ToggleButton} from '../../../../web/js/ui/ToggleButton';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {FilterTagInput} from '../FilterTagInput';
import {TagsDB} from '../TagsDB';
import InputGroup from 'reactstrap/lib/InputGroup';
import Input from 'reactstrap/lib/Input';
import {AnnotationRepoFilters, AnnotationRepoFiltersHandler} from './AnnotationRepoFiltersHandler';
import {FilteredTags} from '../FilteredTags';
import {Placement} from 'popper.js';

const log = Logger.create();

class Styles {

}

export class AnnotationRepoFilterBar extends React.PureComponent<IProps, IState> {

    private handler: AnnotationRepoFiltersHandler;

    private filteredTags: FilteredTags = new FilteredTags();

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

        this.handler = new AnnotationRepoFiltersHandler(filters => this.props.onFiltered(filters));

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

                <div className="mr-2 d-none"
                     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                    <div className="checkbox-group">

                        <ToggleButton id="toggle-flagged"
                                      label="flagged"
                                      initialValue={false}
                                      onChange={value => this.handler.onToggleFlaggedOnly(value)}/>

                        <SimpleTooltip target="toggle-flagged">Only show flagged documents.</SimpleTooltip>

                    </div>

                </div>

                <div className="header-filter-box mr-1 d-none"
                     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                    <div className="checkbox-group">

                        <ToggleButton id="toggle-archived"
                                      label="archived"
                                      initialValue={false}
                                      onChange={value => this.handler.onToggleFilterArchived(value)}/>

                        <SimpleTooltip target="toggle-archived">Show both archived and unarchived documents.  Archived documents are hidden by default.</SimpleTooltip>

                    </div>

                </div>

                <div className="header-filter-box header-filter-tags mr-1"
                     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                    <FilterTagInput id="filter-tag-input"
                                    tagsDBProvider={this.props.tagsDBProvider}
                                    refresher={() => this.handler.onFilterByTags(this.filteredTags)}
                                    tooltip="Filter the annotation list by a specific tag."
                                    filteredTags={this.filteredTags}
                                    tagPopoverPlacement={this.props.tagPopoverPlacement}/>

                </div>

                <div className="header-filter-box mr-1"
                     style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                    <div className="header-filter-box">


                            {/*<InputGroupAddon addonType="prepend">*/}
                            {/*A*/}
                            {/*</InputGroupAddon>*/}

                        {/*<SimpleTooltipEx text="Filter the annotations by the text of the annotation.">*/}

                            <InputGroup size="sm">

                                <Input id="filter_title"
                                       type="text"
                                       placeholder="Filter by text"
                                       onChange={(value) => this.handler.onFilterByText(value.target.value)}/>
                            </InputGroup>

                        {/*</SimpleTooltipEx>*/}


                    </div>

                </div>

                <Right/>

            </div>

        );

    }

}

export interface IProps {

    /**
     * An index of the currently available tags.
     */
    readonly tagsDBProvider: () => TagsDB;

    readonly onFiltered: (filters: AnnotationRepoFilters) => void;

    /**
     * When defined, a JSX element to display on the right of the
     * FilterBar.
     */
    readonly right?: JSX.Element;

    readonly tagPopoverPlacement?: Placement;


}

interface IState {

}

export type ToggleCallback = (value: boolean) => void;
