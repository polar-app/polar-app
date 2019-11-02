import * as React from 'react';
import {TagsDB} from '../../TagsDB';
import InputGroup from 'reactstrap/lib/InputGroup';
import Input from 'reactstrap/lib/Input';
import {PartialAnnotationRepoFilters, UpdateFiltersCallback} from '../AnnotationRepoFiltersHandler';
import {Placement} from 'popper.js';
import {HighlightColorFilterButton} from "./HighlightColorFilterButton";
import {Button} from "reactstrap";
import {Reviewers} from "../../reviewer/Reviewers";
import {RepoAnnotation} from "../../RepoAnnotation";
import {StartReviewButton} from "./StartReviewButton";

export class AnnotationRepoFilterBar extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.startReviewer = this.startReviewer.bind(this);

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
                 className="pr-1"
                 style={{
                     display: 'flex',
                 }}>

                <div className="header-filter-box mr-1 pl-1"
                     style={{
                         whiteSpace: 'nowrap',
                         marginTop: 'auto',
                         marginBottom: 'auto',
                         flexGrow: 1
                     }}>

                    <div className="header-filter-box m-0 mr-1">

                        <InputGroup size="sm">

                            <Input id="filter_title"
                                   type="text"
                                   placeholder="Filter by annotation text"
                                   onChange={(value) => this.props.updateFilters({text: value.target.value})}/>

                        </InputGroup>

                    </div>

                </div>

                {/*<HighlightColorFilterButton onSelected={color => this.props.updateFilters({color})}/>*/}

                <StartReviewButton onClick={() => this.startReviewer()}/>

                <Right/>

            </div>

        );

    }

    private startReviewer() {

        Reviewers.create(this.props.repoAnnotations, 10)
            .catch(err => console.error("Unable to start review: ", err));
    }

}

export interface IProps {

    readonly repoAnnotations: ReadonlyArray<RepoAnnotation>;

    /**
     * An index of the currently available tags.
     */
    readonly tagsDBProvider: () => TagsDB;

    readonly updateFilters: UpdateFiltersCallback;

    /**
     * When defined, a JSX element to display on the right of the
     * FilterBar.
     */
    readonly right?: JSX.Element;

    readonly tagPopoverPlacement?: Placement;


}

interface IState {

}
