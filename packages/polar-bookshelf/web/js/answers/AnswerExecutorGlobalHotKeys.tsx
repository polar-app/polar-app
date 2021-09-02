import * as React from 'react';
import {GlobalKeyboardShortcuts, keyMapWithGroup} from '../keyboard_shortcuts/GlobalKeyboardShortcuts';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import { MUIDialog } from '../ui/dialogs/MUIDialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import {DialogContent, TextField} from "@material-ui/core";
import {JSONRPC} from "../datastore/sharing/rpc/JSONRPC";

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

const AnswerExecutorDialog = () => {

    interface IAnswerResponse {
        readonly answer: string;
    }

    const questionRef = React.useRef("");
    const [answer, setAnswer] = React.useState<IAnswerResponse | undefined>();

    const executeRequest = React.useCallback((question: string) => {

        async function doExec() {

            console.log("Asking question: " + question);
            const answer: IAnswerResponse = await JSONRPC.exec('AnswerExecutor', {question});
            console.log("FIXME: got answer: ", answer);

            setAnswer(answer);

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
        <MUIDialog open={true} maxWidth="md">

            <DialogTitle>Ask AI</DialogTitle>
            <DialogContent>
                <TextField label="Ask a question... "
                           autoFocus={true}
                           onChange={event => questionRef.current = event.currentTarget.value}
                           onKeyUp={handleKeyUp}
                           style={{margin: '10px', width: '400px'}}/>

                {answer && (
                    <div>{answer.answer}</div>
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

    // TODO: only if the answers feature toggle is enabled.

    return (
        <>
            {open && <AnswerExecutorDialog/>}
            <GlobalKeyboardShortcuts
                keyMap={globalKeyMap}
                handlerMap={globalKeyHandlers}/>
        </>
    );

});


