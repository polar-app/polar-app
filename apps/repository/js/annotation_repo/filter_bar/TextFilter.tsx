import * as React from 'react';
import InputGroup from 'reactstrap/lib/InputGroup';
import Input from 'reactstrap/lib/Input';
import {UpdateFiltersCallback} from '../AnnotationRepoFiltersHandler';
import {Platforms} from "../../../../../web/js/util/Platforms";

export class TextFilter extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const width = Platforms.isMobile() ? '150px' : '250px';

        return (
            <InputGroup size="sm">

                <Input id="filter_title"
                       type="text"
                       placeholder="Filter by text"
                       style={{width}}
                       onChange={(value) => this.props.updateFilters({text: value.target.value})}/>

            </InputGroup>

        );

    }

}

export interface IProps {

    readonly updateFilters: UpdateFiltersCallback;

}

interface IState {

}
