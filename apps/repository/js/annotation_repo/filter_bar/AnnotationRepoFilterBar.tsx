import * as React from 'react';
import {TagsDB} from '../../TagsDB';
import {UpdateFiltersCallback} from '../AnnotationRepoFiltersHandler';
import {Placement} from 'popper.js';
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";

export class AnnotationRepoFilterBar extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
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

                {/*<div className="header-filter-box mr-1 pl-1"*/}
                {/*     style={{*/}
                {/*         whiteSpace: 'nowrap',*/}
                {/*         marginTop: 'auto',*/}
                {/*         marginBottom: 'auto',*/}
                {/*         flexGrow: 1*/}
                {/*     }}>*/}

                {/*    <div className="header-filter-box m-0">*/}

                {/*        <TextFilter updateFilters={this.props.updateFilters}/>*/}

                {/*    </div>*/}

                {/*</div>*/}

                {/*/!*<HighlightColorFilterButton onSelected={color => this.props.updateFilters({color})}/>*!/*/}

                {/*<StartReviewButton onClick={() => Reviewers.start(this.props.repoAnnotations, 10)}/>*/}

                {/*<Right/>*/}

            </div>

        );

    }

}

export interface IProps {

    readonly repoAnnotations: ReadonlyArray<IDocAnnotation>;

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
