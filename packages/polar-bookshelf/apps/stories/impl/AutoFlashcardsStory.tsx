import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import {JSONRPC} from "../../../web/js/datastore/sharing/rpc/JSONRPC";
import Button from '@material-ui/core/Button';
import {AutoFlashcards} from "polar-backend-api/src/api/AutoFlashcards";
import AutoFlashcardRequest = AutoFlashcards.AutoFlashcardRequest;
import AutoFlashcardResponse = AutoFlashcards.AutoFlashcardResponse;

export const AutoFlashcardsStory = () => {

    const [result, setResult] = React.useState<AutoFlashcardResponse | undefined>(undefined);

    const [duration, setDuration] = React.useState<number | undefined>(undefined);

    const valueRef = React.useRef("");

    const doExec = React.useCallback(async (query: string) => {

        setDuration(undefined);
        setResult(undefined);

        const before = Date.now();

        const response = await JSONRPC.exec<AutoFlashcardRequest, AutoFlashcardResponse>('autoFlashcard', {
            query_text: query
        })

        const after = Date.now();

        const duration = after - before;

        setDuration(duration);
        setResult(response);

    }, []);

    return (
        <div>

            <TextField id="standard-basic"
                       label="Enter text"
                       onChange={(event) => valueRef.current = event.currentTarget.value} />

            <div style={{display: 'flex'}}>

                <Button size="large"
                        variant="contained"
                        color="primary"
                        onClick={() => doExec(valueRef.current).catch(err => console.error(err))}>

                    Generate

                </Button>
            </div>


            {duration && (
                <div>
                    <b>duration: </b> {duration}
                </div>
            )}

            {result && (
                <div>
                    <b>front: </b> {result.front} <br/>
                    <b>back: </b> {result.back} <br/>
                </div>
            )}

        </div>
    );

}