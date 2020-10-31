import * as React from "react";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {IField} from "./DocMetadataEditor";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button";

interface IProps extends IField {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly docInfo: IDocInfo;
    readonly values: ReadonlyArray<string> | undefined;
    readonly onUpdate: (docInfo: IDocInfo) => void;
}

export const StringArrayField = deepMemo((props: IProps) => {

    const values = React.useMemo(() => props.values || [], [props.values]);

    const handleUpdate = React.useCallback((values: ReadonlyArray<string>) => {

        const newDocInfo = Dictionaries.copyOf(props.docInfo);
        newDocInfo[props.name] = values.filter(current => current.trim() !== '');

        props.onUpdate(newDocInfo);

    }, [props]);

    const handleAddValue = React.useCallback(() => {
        handleUpdate([...values, '']);
    }, [handleUpdate, values])

    const handleUpdatedValue = React.useCallback((value: string, idx: number) => {

        const newValues = [...values];
        newValues[idx] = value;
        handleUpdate(newValues);

    }, [handleUpdate, values]);

    return (
        <div className={props.className}
             style={props.style}>

            {values.map((current, idx) => (
                <TextField key={idx}
                           required={false}
                           label={props.name}
                           defaultValue={current || ''}
                           onChange={event => handleUpdatedValue(event.target.value, idx)}/>
            ))}


           <div style={{textAlign: 'right'}}>

               <Button variant="contained"
                       size="small"
                       onClick={handleAddValue}>
                   Add Value
               </Button>

           </div>

        </div>
    );
});
