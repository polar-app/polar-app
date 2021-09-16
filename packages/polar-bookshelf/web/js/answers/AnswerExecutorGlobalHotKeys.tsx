import * as React from 'react';
import {GlobalKeyboardShortcuts, keyMapWithGroup} from '../keyboard_shortcuts/GlobalKeyboardShortcuts';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import {MUIDialog} from '../ui/dialogs/MUIDialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Box, DialogContent, LinearProgress, TextField, Typography} from "@material-ui/core";
import {JSONRPC} from "../datastore/sharing/rpc/JSONRPC";
import {FeatureToggle} from "../../../apps/repository/js/persistence_layer/PrefsContext2";
import {Arrays} from 'polar-shared/src/util/Arrays';
import {
    IAnswerExecutorError,
    IAnswerExecutorResponse,
    ISelectedDocumentWithRecord
} from "polar-answers-api/src/IAnswerExecutorResponse";
import {IAnswerExecutorRequest, ICoreAnswerExecutorRequest} from "polar-answers-api/src/IAnswerExecutorRequest";
import {IAnswerDigestRecord} from "polar-answers-api/src/IAnswerDigestRecord";
import {useAnalytics} from "../analytics/Analytics";
import {IAnswerExecutorTraceUpdate} from "polar-answers-api/src/IAnswerExecutorTraceUpdate";
import {
    IAnswerExecutorTraceUpdateError,
    IAnswerExecutorTraceUpdateResponse
} from "polar-answers-api/src/IAnswerExecutorTraceUpdateResponse";
import {IRPCError} from "polar-shared/src/util/IRPCError";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import {MUILoadingIconButton} from "../mui/MUILoadingIconButton";
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";

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
                    keys: 'ctrl+i',
                    platforms: ['windows', 'linux']
                }

            ]
        },

    }
});

interface IAnswerExecutorDialogProps {
    readonly onClose: () => void;
}

interface SelectedDocumentProps {
    readonly doc: ISelectedDocumentWithRecord<IAnswerDigestRecord>
}

const SelectedDocument = (props: SelectedDocumentProps) => {

    return (
        <>
            <p style={{
                   fontSize: '2.0rem',
                   overflow: 'auto'
               }}>

                {props.doc.record.text}

            </p>
            <p>score: {props.doc.score}</p>

            {props.doc.record.type === 'pdf' && (
                <>
                    <p>docID: {props.doc.record.docID}</p>
                </>
            )}
        </>
    );

}

interface TabPanelProps {
    readonly index: number;
    readonly tabIndex: number;
    readonly children: JSX.Element;
}

const TabPanel = (props: TabPanelProps) => {

    if (props.index === props.tabIndex) {
        return (
            <Box mt={1} mb={1}>
                {props.children}
            </Box>
        );
    }

    return null;

}

function answerIsError(value: any): value is IAnswerExecutorError {
    return value.error === true;
}

function answerIsErrorNoAnswer(value: any): value is IAnswerExecutorError {
    return value.error === 'no-answer';
}

interface AnswerFeedbackProps {
    readonly id: string;
}

const AnswerFeedback = (props: AnswerFeedbackProps) => {

    const answerExecutorTraceUpdateClient = useAnswerExecutorTraceUpdateClient();

    const [voted, setVoted] = React.useState(false);

    const doVote = React.useCallback(async (vote: 'up' | 'down') => {

        await answerExecutorTraceUpdateClient({id: props.id, vote, expectation: ''})

        setVoted(true);

    }, [answerExecutorTraceUpdateClient]);

    const handleDone = React.useCallback(() => {
        setVoted(true);
    }, [doVote]);

    const handleError = React.useCallback((err: Error) => {
        console.error("Unable to handle vote: ", err);
    }, [doVote]);

    return (
        <Box color="text.secondary"
             style={{
                 display: 'flex',
                 justifyContent: 'flex-end'
             }}>

            <MUILoadingIconButton disabled={voted}
                                  icon={<ThumbUpIcon/>}
                                  onDone={handleDone}
                                  onError={handleError}
                                  onClick={async () => doVote('up')}/>

            <MUILoadingIconButton disabled={voted}
                                  icon={<ThumbDownIcon/>}
                                  onDone={handleDone}
                                  onError={handleError}
                                  onClick={async () => doVote('down')}/>

        </Box>
    );

}

interface AnswerResponseProps {
    readonly answerResponse: IAnswerExecutorResponse | IAnswerExecutorError;
}

const AnswerResponse = (props: AnswerResponseProps) => {

    // TODO: we have to differentiate between a real error and no-answer.
    if (answerIsError(props.answerResponse)) {
        return (
            <Box mt={1} mb={1} color='error.main'>
                <Typography variant="h5" gutterBottom>
                    Honestly, no idea.  We're stumped and unable to give you an answer.
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <div style={{overflow: 'auto'}}>

                {props.answerResponse.answers.length > 0 && (
                    <>

                        <Box mt={1} mb={1} color="text.secondary">
                            <Typography variant="h6">
                                Answer:
                            </Typography>
                        </Box>

                        <p style={{
                            fontSize: '2.0rem',
                            overflow: 'auto'
                        }}>

                            {Arrays.first(props.answerResponse.answers)}

                        </p>

                        <AnswerFeedback id={props.answerResponse.id}/>

                    </>)}

                {props.answerResponse.selected_documents.length > 0 && (
                    <>
                        <Box mt={1} mb={1} color="text.secondary">
                            <Typography variant="h6">
                                Relevant text extracts:
                            </Typography>
                        </Box>

                        {[...props.answerResponse.selected_documents].sort((a,b) => b.score - a.score)
                            .map((current, idx) => (
                                <SelectedDocument key={idx} doc={current}/>))}

                    </>)}

            </div>

        </>
    );
}


/**
 * Create a simple RPC binding
 * @param methodName The RPC to call.
 * @param toEvent Convert the request to an analytics event
 */
function useRPC<REQ, RES, E extends IRPCError<string>>(methodName: string,
                                                                toEvent: (request: REQ) => Record<string, string | number>) {

    const analytics = useAnalytics();
    const dialogManager = useDialogManager();

    return React.useCallback(async (request: REQ) => {

        // TODO: what if we're offline?

        try {

            const response: RES | E = await JSONRPC.exec(methodName, request);

            function isError(response: RES | E): response is E {
                return (response as any).error === true;
            }

            if (isError(response)) {

                analytics.event2(methodName, {
                    error: true,
                    code: response.code
                });

                dialogManager.snackbar({
                    type: 'error',
                    message: `The request failed: ${(response as any).message || response.code}`
                });

            } else {
                analytics.event2(methodName, toEvent(request));
            }

            return response;

        } catch (e) {

            analytics.event2(methodName, {
                error: true,
                code: 'exception',
                message: (e as any).message
            });

            throw e;

        }


    }, [analytics]);

}

function useAnswerExecutorTraceUpdateClient() {

    return useRPC<IAnswerExecutorTraceUpdate, IAnswerExecutorTraceUpdateResponse, IAnswerExecutorTraceUpdateError>('AnswerExecutorTraceUpdate', (req) => ({
        vote: req.vote!
    }));

}


function useAnswerExecutorClient() {

    return useRPC<IAnswerExecutorRequest, IAnswerExecutorResponse, IAnswerExecutorError>('AnswerExecutor', (req) => ({
    }));

}



// localStorage.setItem("CoreAnswerExecutorRequest", "{\"model\": \"babbage\", \"search_model\": \"babbage\"}");
// localStorage.removeItem("CoreAnswerExecutorRequest");
function useCoreAnswerExecutorRequestFromLocalStorage(): ICoreAnswerExecutorRequest | undefined {

    const item = localStorage.getItem('CoreAnswerExecutorRequest');

    if (item) {
        return JSON.parse(item) as ICoreAnswerExecutorRequest;
    }

    return undefined;

}

const AnswerExecutorDialog = (props: IAnswerExecutorDialogProps) => {

    const questionRef = React.useRef("");
    const [answerResponse, setAnswerResponse] = React.useState<IAnswerExecutorResponse | IAnswerExecutorError | undefined>();
    const [waiting, setWaiting] = React.useState(false);
    const [executeWithoutDocuments, setExecuteWithoutDocuments] = React.useState(false);
    const answerExecutorClient = useAnswerExecutorClient();

    // TODO
    //
    // - show the models in one of the tabs
    // - try to fit the dialog to the screen
    // - run the same query but don't send documents... this way we can compare it to OpenAI directly.
    // - show ES and OpenAI timings along with the models in a dedicate tab
    // - "Ask" button to the right of the question text
    // - docLoader to load the document by docID

    const coreAnswerExecutorRequest = useCoreAnswerExecutorRequestFromLocalStorage();

    const executeRequest = React.useCallback((question: string) => {

        async function doExec() {

            console.log("Asking question: " + question);

            try {

                setAnswerResponse(undefined);
                setWaiting(true);

                const request: IAnswerExecutorRequest = {
                    question,
                    model: coreAnswerExecutorRequest?.model || 'curie',
                    search_model: coreAnswerExecutorRequest?.search_model || 'curie',
                    rerank_elasticsearch: coreAnswerExecutorRequest?.rerank_elasticsearch || undefined,
                    rerank_elasticsearch_size: coreAnswerExecutorRequest?.rerank_elasticsearch_size || 10000,
                    rerank_elasticsearch_model: coreAnswerExecutorRequest?.rerank_elasticsearch_model || undefined,
                    filter_question: coreAnswerExecutorRequest?.filter_question || undefined,
                };

                console.log("Executing request: ", JSON.stringify(request, null, '  '));

                const answer = await answerExecutorClient(request);

                console.log("Got answer: ", JSON.stringify(answer, null, '  '));

                setAnswerResponse(answer);

            } finally {
                setWaiting(false);
            }

        }

        doExec()
            .catch(err => console.error("Unable to answer question: " + question, err));

    }, [executeWithoutDocuments])

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent) => {

        if (event.key === 'Enter') {
            executeRequest(questionRef.current)
        }

    }, [executeRequest])

    return (
        <MUIDialog open={true}
                   maxWidth="md"
                   fullWidth={true}
                   PaperProps={{
                       style: {
                           position: 'absolute',
                           top: '0'
                       }
                   }}
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

                {/*<FormControlLabel*/}
                {/*    control={*/}
                {/*        <Checkbox*/}
                {/*            checked={executeWithoutDocuments}*/}
                {/*            onChange={(event, checked) => setExecuteWithoutDocuments(checked)}*/}
                {/*            name="executeWithoutDocuments"*/}
                {/*        />*/}
                {/*    }*/}
                {/*    label="Execute without documents"*/}
                {/*/>*/}

                {answerResponse && (
                    <>

                        <AnswerResponse key={questionRef.current} answerResponse={answerResponse}/>

                    </>
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


