import * as React from 'react';
import {UpdateFiltersCallback} from '../AnnotationRepoFiltersHandler';
import {MUISearchBox2} from "../../../../../web/js/mui/MUISearchBox2";

/**
 * @Deprecated MUI
 */
export class TextFilter extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const width = '250px';

        return (

            <MUISearchBox2 id="filter_title"
                           placeholder="Filter by text"
                           style={{width}}
                           onChange={(value) => this.props.updateFilters({text: value})}/>


        );

    }

}

export interface IProps {

    readonly updateFilters: UpdateFiltersCallback;

}

interface IState {

}
