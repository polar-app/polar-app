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

export class StartReviewButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <Button color="success"
                    size="sm"
                    className="font-weight-bold p-0 pl-2 pr-2"
                    style={{whiteSpace: 'nowrap'}}
                    onClick={() => this.props.onClick()}>

                    <i className="fas fa-graduation-cap mr-1"/> Start Review

            </Button>

        );

    }


}

export interface IProps {

    readonly onClick: () => void;

}

interface IState {

}
