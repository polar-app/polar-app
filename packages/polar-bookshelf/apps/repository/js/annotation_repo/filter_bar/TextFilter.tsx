import * as React from 'react';
import InputGroup from 'reactstrap/lib/InputGroup';
import {UpdateFiltersCallback} from '../AnnotationRepoFiltersHandler';
import {InputFilter} from "../../../../../web/js/ui/input_filter/InputFilter2";

export class TextFilter extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const width = '250px';

        return (
            <InputGroup size="md">

                {/*<Input id="filter_title"*/}
                {/*       type="text"*/}
                {/*       placeholder="Filter by text"*/}
                {/*       onChange={(value) => this.props.updateFilters({text: value.target.value})}/>*/}

                <InputFilter id="filter_title"
                              placeholder="Filter by text"
                              style={{width}}
                              onChange={(value) => this.props.updateFilters({text: value})}/>

            </InputGroup>

        );

    }

}

export interface IProps {

    readonly updateFilters: UpdateFiltersCallback;

}

interface IState {

}
