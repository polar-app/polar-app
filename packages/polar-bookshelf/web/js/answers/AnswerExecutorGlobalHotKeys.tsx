import * as React from 'react';
import {GlobalKeyboardShortcuts, keyMapWithGroup} from '../keyboard_shortcuts/GlobalKeyboardShortcuts';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import { MUIDialog } from '../ui/dialogs/MUIDialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import {DialogContent, LinearProgress, TextField} from "@material-ui/core";
import {JSONRPC} from "../datastore/sharing/rpc/JSONRPC";
import {FeatureToggle} from "../../../apps/repository/js/persistence_layer/PrefsContext2";
import { Arrays } from 'polar-shared/src/util/Arrays';

const globalKeyMap = keyMapWithGroup({
    group: "Answers",
    groupPriority: -1,
    keyMap: {

        ANSWER_EXECUTOR: {
            icon: <QuestionAnswerIcon/>,
            name: "Ask Question from AI",
            description: "Ask a question from the AI system and receive an answer.",
            sequences: [
                {
                    keys: 'command+i',
                    platforms: ['macos']
                },
                {
                    keys: 'ctrl+a+i',
                    platforms: ['windows', 'linux']
                }

            ]
        },

    }
});

interface IAnswerExecutorDialogProps {
    readonly onClose: () => void;
}

const AnswerExecutorDialog = (props: IAnswerExecutorDialogProps) => {

    interface IAnswerResponse {
        readonly answers: ReadonlyArray<string>;
    }

    const questionRef = React.useRef("");
    const [answerResponse, setAnswerResponse] = React.useState<IAnswerResponse | undefined>();
    const [waiting, setWaiting] = React.useState(false);

    const executeRequest = React.useCallback((question: string) => {

        async function doExec() {

            console.log("Asking question: " + question);

            try {
                setWaiting(true);

                const answer: IAnswerResponse = await JSONRPC.exec('AnswerExecutor', {question, model: 'curie', search_model: 'curie'});

                console.log("Got answer: ", answer);

                setAnswerResponse(answer);

            } finally {
                setWaiting(false);
            }

        }

        doExec()
            .catch(err => console.error("Unable to answer question: " + question, err));

    }, [])

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent) => {

        if (event.key === 'Enter') {
            executeRequest(questionRef.current)
        }

    }, [executeRequest])

    return (
        <MUIDialog open={true}
                   maxWidth="md"
                   fullWidth={true}
                   onClose={props.onClose}>

            <div style={{height: '5px'}}>
                {waiting && (
                        <LinearProgress variant="indeterminate"/>
                )}
            </div>

            <DialogTitle>Ask AI</DialogTitle>
            <DialogContent style={{
                               display: 'flex',
                               flexDirection: 'column',
                           }}>

                <TextField label="Ask a question... "
                           placeholder="What would you like to know?"
                           autoFocus={true}
                           onChange={event => questionRef.current = event.currentTarget.value}
                           onKeyUp={handleKeyUp}
                           InputProps={{
                               style: {
                                   fontSize: '2.0rem'
                               }
                           }}
                           style={{
                               marginTop: '10px',
                               marginBottom: '10px',
                               flexGrow: 1,
                           }}/>

                {answerResponse && answerResponse.answers.length > 0 && (
                    <p style={{
                           fontSize: '2.0rem',
                           overflow: 'auto'
                       }}>

                        {Arrays.first(answerResponse.answers)}

                    </p>
                )}

            </DialogContent>

        </MUIDialog>
    );

}

export const AnswerExecutorGlobalHotKeys = React.memo(function AnswerExecutorGlobalHotKeys() {

    const [open, setOpen] = React.useState(false)

    const globalKeyHandlers = {
        ANSWER_EXECUTOR: () => setOpen(true),
    };

    return (
        <FeatureToggle featureName='answers'>
            <>
                {open && <AnswerExecutorDialog onClose={() => setOpen(false)}/>}

                <GlobalKeyboardShortcuts
                    keyMap={globalKeyMap}
                    handlerMap={globalKeyHandlers}/>
            </>
        </FeatureToggle>
    );

});


