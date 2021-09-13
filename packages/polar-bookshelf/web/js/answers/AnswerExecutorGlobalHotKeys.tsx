import * as React from 'react';
import {GlobalKeyboardShortcuts, keyMapWithGroup} from '../keyboard_shortcuts/GlobalKeyboardShortcuts';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import {MUIDialog} from '../ui/dialogs/MUIDialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Box, DialogContent, LinearProgress, Tab, Tabs, TextField, Typography} from "@material-ui/core";
import {JSONRPC} from "../datastore/sharing/rpc/JSONRPC";
import {FeatureToggle} from "../../../apps/repository/js/persistence_layer/PrefsContext2";
import {Arrays} from 'polar-shared/src/util/Arrays';
import {
    IAnswerExecutorError,
    IAnswerExecutorResponse,
    ISelectedDocumentWithRecord
} from "polar-answers-api/src/IAnswerExecutorResponse";
import {IAnswerExecutorRequest} from "polar-answers-api/src/IAnswerExecutorRequest";
import {IAnswerDigestRecord} from "polar-answers-api/src/IAnswerDigestRecord";
import {useAnalytics} from "../analytics/Analytics";
import {IAnswerExecutorTraceUpdate} from "polar-answers-api/src/IAnswerExecutorTraceUpdate";
import {
    IAnswerExecutorTraceUpdateError,
    IAnswerExecutorTraceUpdateResponse
} from "polar-answers-api/src/IAnswerExecutorTraceUpdateResponse";
import {IRPCError} from "polar-shared/src/util/IRPCError";

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
    return value.error === 'no-answer' || value.error === 'failed';
}

function answerIsErrorNoAnswer(value: any): value is IAnswerExecutorError {
    return value.error === 'no-answer';
}

interface AnswerResponseProps {
    readonly answerResponse: IAnswerExecutorResponse | IAnswerExecutorError;
}

const AnswerResponse = (props: AnswerResponseProps) => {

    const [tabIndex, setTabIndex] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

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

            <Tabs indicatorColor="primary"
                  textColor="primary"
                  centered
                  value={tabIndex}
                  onChange={handleChange}>
                <Tab label="Answer"/>
                <Tab label="Context" />
            </Tabs>

            <div style={{overflow: 'auto'}}>
                <TabPanel index={0} tabIndex={tabIndex}>
                    <>
                        {props.answerResponse.answers.length > 0 && (
                            <p style={{
                                fontSize: '2.0rem',
                                overflow: 'auto'
                            }}>

                                {Arrays.first(props.answerResponse.answers)}

                            </p>)}
                    </>
                </TabPanel>
                <TabPanel index={1} tabIndex={tabIndex}>
                    <>
                        {[...props.answerResponse.selected_documents].sort((a,b) => b.score - a.score)
                                                                     .map((current, idx) => (
                            <SelectedDocument key={idx} doc={current}/>))}
                    </>
                </TabPanel>
            </div>

        </>
    );
}

function useAnswerExecutorClient() {

    const analytics = useAnalytics();

    return React.useCallback(async (request: IAnswerExecutorRequest) => {

        // TODO: what if we're offline?

        try {

            const response: IAnswerExecutorResponse | IAnswerExecutorError = await JSONRPC.exec('AnswerExecutor', request);

            analytics.event2('ai-answer-executor', {
                error: answerIsError(response) ? response.error : 'none'
            });

            return response;

        } catch (e) {

            analytics.event2('ai-answer-executor-failed', {
                error: 'exception',
                message: e.message
            });

            throw e;

        }


    }, [analytics]);

}

/**
 * Create a simple RPC binding
 * @param methodName The RPC to call.
 * @param toEvent Convert the request to an analytics event
 */
function useRPC<REQ, RES, E extends IRPCError>(methodName: string,
                                               toEvent: (request: REQ) => Record<string, string | number>) {

    const analytics = useAnalytics();

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

            } else {
                analytics.event2(methodName, toEvent(request));
            }

            return response;

        } catch (e) {

            analytics.event2(methodName, {
                error: true,
                code: 'exception',
                message: e.message
            });

            throw e;

        }


    }, [analytics]);

}

function useAnswerExecutorTraceUpdateClient() {

    const analytics = useAnalytics();

    return React.useCallback(async (request: IAnswerExecutorTraceUpdate) => {

        // TODO: what if we're offline?

        try {

            const response: IAnswerExecutorTraceUpdateResponse | IAnswerExecutorTraceUpdateError = await JSONRPC.exec('AnswerExecutorTraceUpdate', request);

            analytics.event2('ai-answer-executor-trace-update', {
                vote: request.vote
            });

            return response;

        } catch (e) {

            analytics.event2('ai-answer-executor-trace-update-failed', {
                error: 'exception',
                message: e.message
            });

            throw e;

        }


    }, [analytics]);

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

    const executeRequest = React.useCallback((question: string) => {

        async function doExec() {

            console.log("Asking question: " + question);

            try {

                setAnswerResponse(undefined);
                setWaiting(true);

                const request: IAnswerExecutorRequest = {
                    question,
                    model: 'curie',
                    search_model: 'curie'
                };

                const answer = await answerExecutorClient(request);

                console.log("Got answer: ", answer);

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


