import * as React from 'react';
import InputGroup from 'reactstrap/lib/InputGroup';
import Input from 'reactstrap/lib/Input';
import {UpdateFiltersCallback} from '../AnnotationRepoFiltersHandler';
import {Platforms} from "polar-shared/src/util/Platforms";
import {InputFilter} from "../../../../../web/js/ui/input_filter/InputFilter";

export class TextFilter extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const width = Platforms.isMobile() ? '150px' : '250px';

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
