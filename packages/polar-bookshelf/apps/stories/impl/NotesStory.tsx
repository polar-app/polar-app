import React from 'react';
import {NotesRouter} from "../../../web/js/notes/NotesRouter";
import Fab from '@material-ui/core/Fab';
import HelpIcon from '@material-ui/icons/Help';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {BlocksStoreProvider, useBlocksStore} from '../../../web/js/notes/store/BlocksStore';
import {MockNotes} from "./MockNotes";
import { observer } from "mobx-react-lite"

const notes = MockNotes.create();

interface BasicNotesDataSetProps {
    readonly children: JSX.Element;
}

const NotesStoryDebug = observer(() => {

    const store = useBlocksStore();

    return (
        <div>
            <b>active id: {store.active?.id}</b><br/>
            <b>active pos: {store.active?.pos}</b><br/>
            <b>root: {store.root}</b><br/>
            <b>index: </b><br/>
            <pre>
            {JSON.stringify(store.index, null, '  ')}
            </pre>
            <b>reverse: </b><br/>
            <pre>
            {JSON.stringify(store.reverse, null, '  ')}
            </pre>
        </div>
    );
});

const NotesStoryDebugButton = () => {

    const [active, setActive] = React.useState(false);

    return (
        <>

            {active && (
                <Dialog open={active} maxWidth="xl" onClose={() => setActive(false)}>
                    <DialogContent>
                        <NotesStoryDebug/>
                    </DialogContent>
                </Dialog>
            )}

            <Fab color="primary"
                 style={{
                     zIndex: 10,
                     position: 'absolute',
                     right: '20px',
                     bottom: '20px'
                 }}
                 onClick={() => setActive(true)}>
                <HelpIcon/>
            </Fab>
        </>
    )
}

const NotesStoryInner = () => (
    <div className="NotesStoryInner"
         style={{
             display: 'flex',
             flexGrow: 1
         }}>

        <NotesRouter/>

        <NotesStoryDebugButton/>

        {/*<div style={{*/}
        {/*         width: '500px',*/}
        {/*         fontSize: '10px',*/}
        {/*         overflow: 'auto'*/}
        {/*     }}>*/}

        {/*    <NotesStoryDebug/>*/}

        {/*</div>*/}
    </div>
);

const BasicNotesDataSet = (props: BasicNotesDataSetProps) => {

    const store = useBlocksStore();

    React.useMemo(() => store.doPut(notes), [store]);

    return props.children;

}

interface FixedWidthContainer {
    readonly children: JSX.Element;
}

const FixedWidthContainer = React.memo(function FixedWidthContainer(props: FixedWidthContainer) {

    return (
        <div className="FixedWidthContainer"
             style={{
                 maxWidth: '1000px',
                 flexGrow: 1,
                 marginLeft: 'auto',
                 marginRight: 'auto'
             }}>
            {props.children}
        </div>
    );

});

export const NotesStory = () => {

    return (
        <FixedWidthContainer>
            <BlocksStoreProvider>
                <BasicNotesDataSet>
                    <>
                        <NotesStoryInner/>
                    </>
                </BasicNotesDataSet>
            </BlocksStoreProvider>
        </FixedWidthContainer>
    );

}

