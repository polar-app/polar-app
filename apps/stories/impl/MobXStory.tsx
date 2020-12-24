import * as React from 'react';
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import Button from '@material-ui/core/Button';

// TODO see if I ca useActiveNote and get the one from the list ot items and that it won't update until the value is
// added back in


interface INoteProps {
    readonly note: INote;
}

const Note = observer((props: INoteProps) => {
    const {note} = props;
    return (
        <div>

            <Button onClick={() => note.text = 'this is changed'} variant="contained">
                Update it
            </Button>

            {note.id}: {note.text}
        </div>
    )
});

let seq = 0

const Root = observer(() => {

    const store = useMyStoreContext();

    const createNote = React.useCallback(() => {

        const id = seq++;
        store.notes.push(makeAutoObservable({
          id,
          text: 'asdf: ' + id
        }));

    }, [store.notes]);

    return (
        <div>

            <p>
                <Button onClick={createNote} variant="contained">
                    create a note
                </Button>
            </p>


            notes:
            {store.notes.map(current => <Note key={current.id} note={current}/>)}
        </div>
    );

});

export const MobXStory = () => {

    return (
        <MyStoreContextProvider>
            <Root/>
        </MyStoreContextProvider>
    );

}

interface INote {
    readonly id: number;
    text: string;
}

class MyStore {

    readonly notes: INote[] = [];

    constructor() {
        makeAutoObservable(this);
    }

}

const MyStoreContext = React.createContext(new MyStore());

interface IMyStoreContextProviderProps {
    readonly children: JSX.Element;
}

const MyStoreContextProvider = React.memo((props: IMyStoreContextProviderProps) => {
    return (
        <MyStoreContext.Provider value={new MyStore()}>
            {props.children}
        </MyStoreContext.Provider>
    );
});

function useMyStoreContext() {
    return React.useContext(MyStoreContext);
}
