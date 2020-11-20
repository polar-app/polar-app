import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import {JSONRPC} from "../../../web/js/datastore/sharing/rpc/JSONRPC";
import Button from '@material-ui/core/Button';

export const AutoFlashcardsStory = () => {

    const [result, setResult] = React.useState<string | undefined>(undefined);

    const valueRef = React.useRef("");

    const doExec = React.useCallback(async (query: string) => {

        const response = await JSONRPC.exec('autoFlashcard', {
            query_text: query
        })

        console.log("FIXME: response: ", response);

    }, []);

    return (
        <div>

            <TextField id="standard-basic" label="Standard" onChange={(event) => valueRef.current = event.currentTarget.value} />

            {result && (
                {result}
            )}

            <Button onClick={() => doExec(valueRef.current).catch(err => console.error(err))}>Generate</Button>
        </div>
    );

}