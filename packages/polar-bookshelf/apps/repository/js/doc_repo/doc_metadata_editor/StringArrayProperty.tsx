import * as React from "react";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {DocInfoProperty} from "./DocMetadataEditor";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { Strings } from "polar-shared/src/util/Strings";

interface IProps extends DocInfoProperty {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly docInfo: IDocInfo;
    readonly values: ReadonlyArray<string> | undefined;
    readonly onUpdate: (docInfo: IDocInfo) => void;
}

export const StringArrayProperty = deepMemo(function StringArrayProperty(props: IProps) {

    const values = React.useMemo(() => props.values || [], [props.values]);

    const handleUpdate = React.useCallback((values: ReadonlyArray<string>) => {

        const newDocInfo: any = Dictionaries.deepCopy(props.docInfo);
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

    const label = props.label || Strings.upperFirst(props.name);

    return (
        <div className={props.className}
             style={{
                 ...props.style,
                 display: 'flex',
                 flexDirection: 'column'
             }}>

            {values.map((current, idx) => {
                return (
                    <Box key={idx} mb={1} style={{display: 'flex'}}>
                        <TextField required={false}
                                   style={{flexGrow: 1}}
                                   label={idx === 0 ? label : undefined}
                                   defaultValue={current || ''}
                                   onChange={event => handleUpdatedValue(event.target.value, idx)}/>
                    </Box>
                );
            })}


           <div style={{textAlign: 'right'}}>

               <Button variant="contained"
                       size="small"
                       onClick={handleAddValue}>
                   Add
               </Button>

           </div>

        </div>
    );
});
