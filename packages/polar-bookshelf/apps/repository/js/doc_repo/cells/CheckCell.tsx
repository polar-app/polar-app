import * as React from 'react';
import {SelectRowType} from "../DocRepoScreen";
import {Arrays} from "polar-shared/src/util/Arrays";
import {Checkbox} from "../../../../../web/js/ui/Checkbox";

export class CheckCell extends React.Component<IProps> {

    public shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<any>, nextContext: any): boolean {

        if (this.props.viewIndex !== nextProps.viewIndex) {
            return true;
        }

        return ! Arrays.equal(this.props.selected, nextProps.selected);

    }

    public render() {

        const {selected, viewIndex, selectRow} = this.props;

        return (<div style={{
                         lineHeight: '1em',
                         display: 'flex'
                     }}>

                <Checkbox checked={selected.includes(viewIndex)}
                          style={{
                              margin: 'auto',
                              fontSize: '1.2em'
                          }}
                          className="m-auto text-secondary"
                          onClick={(event) => selectRow(viewIndex, event.nativeEvent, 'checkbox')}/>

                {/*<i className="far fa-square"></i>*/}

            </div>
        );

    }

}

interface IProps {
    readonly viewIndex: number;
    readonly selected: ReadonlyArray<number>;
    readonly selectRow: (selectedIdx: number, event: MouseEvent, type: SelectRowType) => void;

}
