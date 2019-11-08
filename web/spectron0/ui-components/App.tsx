import * as React from 'react';
import {Tags} from 'polar-shared/src/tags/Tags';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Group} from "../../js/datastore/sharing/db/Groups";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {
    Task,
    TaskRep,
    TasksCalculator
} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Reviewer} from "../../../apps/repository/js/reviewer/Reviewer";
import {LightModal} from "../../js/ui/LightModal";
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {Lorems} from "polar-shared/src/util/Lorems";
import {Flashcards} from "../../js/metadata/Flashcards";
import {Refs} from "polar-shared/src/metadata/Refs";
import {RepoAnnotations} from "../../../apps/repository/js/RepoAnnotations";
import {DocInfos} from "../../js/metadata/DocInfos";
import {ReviewerTasks} from "../../../apps/repository/js/reviewer/ReviewerTasks";
import {FlashcardTaskAction} from "../../../apps/repository/js/reviewer/cards/FlashcardTaskAction";
import {FlashcardTaskActions} from "../../../apps/repository/js/reviewer/cards/FlashcardTaskActions";
import {FlashcardCard} from "../../../apps/repository/js/reviewer/cards/FlashcardCard";

const styles = {
    swatch: {
        width: '30px',
        height: '30px',
        float: 'left',
        borderRadius: '4px',
        margin: '0 6px 6px 0',
    }
};

const Folders = () => {
    return <div style={{backgroundColor: 'red', overflow: 'auto'}}>
        these are the folders
    </div>;
};

const Preview = () => {
    return <div style={{backgroundColor: 'orange', overflow: 'auto'}}>
        This is the preview
    </div>;
};


const Main = () => {
    return <div style={{backgroundColor: 'blue'}}>this is the right</div>;
};

export class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

    }

    public render() {


        //
        // const root: TNode<TagNode> = {
        //     id: 0,
        //     name: 'CompSci',
        //     children: [
        //         {
        //             id: 1,
        //             name: 'Linux',
        //             children: [],
        //             value: {
        //                 tag: "/CompSci/Linux"
        //             }
        //         },
        //         {
        //             id: 2,
        //             name: 'Google',
        //             children: [
        //                 {
        //                     id: 3,
        //                     name: 'Mountain View',
        //                     children: [],
        //                     value: {
        //                         tag: "/CompSci/Google/Mountain View"
        //                     }
        //                 },
        //                 {
        //                     id: 4,
        //                     name: 'San Francisco',
        //                     children: [],
        //                     value: {
        //                         tag: "/CompSci/Google/San Francisco"
        //                     }
        //                 },
        //             ],
        //             value: {
        //                 tag: "/CompSci/Google"
        //             }
        //
        //         }
        //
        //     ],
        //     value: {
        //         tag: "/CompSci"
        //     }
        // };

        // Dialogs.confirm({title: 'hello world',
        //                  subtitle: 'Some really bad stuff is happening right now which you should probably look into.',
        //                  onConfirm: NULL_FUNCTION,
        //                  type: 'warning'});

        // Dialogs.prompt({title: 'Give me something ',
        //                 onCancel: NULL_FUNCTION,
        //                 onDone: NULL_FUNCTION});

        // PreviewWarnings.createDialog(NULL_FUNCTION);

        const tags = [
            '/CompSci/Google',
            '/CompSci/Linux',
            '/CompSci/Microsoft',
            '/CompSci/Programming Languages/C++',
            '/CompSci/Programming Languages/Java',
            '/History/WWII',
            '/History/United States/WWII',
        ].map(current => Tags.create(current))
            .map(current => {
                const count = Math.floor(Math.random() * 100);
                return {...current, count};
            });

        // // const root: TNode<Tag> = TagNodes.create(...tags);
        // Dialogs.prompt({
        //                    title: "Enter the name of a new folder:",
        //                    validator: () => {
        //                        return {message: "it failed dude"};
        //                    },
        //                    onCancel: NULL_FUNCTION,
        //                    onDone: NULL_FUNCTION
        //
        //                });

        const group: Group = {
            nrMembers: 100,
            name: 'Linux',
            description: "A group about Linux, Ubuntu, Debian, and UNIX operating systems.",
            id: "101",
            visibility: 'public',
            created: ISODateTimeStrings.create()
        };

        const keyBindingHandler = (event: React.KeyboardEvent) => {

            if (event.key === 'F') {
                console.log("YUP!")
            }

        };


        const createReadingTaskReps = () => {

            const lorem = Lorems.mediumLength();

            const tasks: ReadonlyArray<Task<string>> = [
                {
                    id: "10102",
                    action: lorem,
                    created: ISODateTimeStrings.create(),
                    color: 'red',
                    mode: 'reading'
                },
                {
                    id: "10101",
                    action: "this is the first one",
                    created: ISODateTimeStrings.create(),
                    color: 'yellow',
                    mode: 'reading'
                },
                {
                    id: "10102",
                    action: "this is the second one",
                    created: ISODateTimeStrings.create(),
                    color: 'yellow',
                    mode: 'reading'
                },
            ];

            return tasks.map(task => TasksCalculator.createInitialLearningState(task));

        };

        // const createFlashcardTaskReps = async (): Promise<ReadonlyArray<TaskRep<FlashcardTaskAction>>> => {
        //
        //     const ref = Refs.create('1234', 'text-highlight');
        //
        //     const flashcard = Flashcards.createFrontBack('What is the capital of California? ', 'Sacramento', ref);
        //
        //     const docInfo = DocInfos.create('0x0001', 1);
        //     const repoAnnotation = RepoAnnotations.toRepoAnnotation(null!, flashcard, AnnotationType.FLASHCARD, docInfo);
        //     const repoAnnotations = [repoAnnotation];
        //
        //     return ReviewerTasks.createFlashcardTasks(repoAnnotations, 10);
        //
        // };

        const createFlashcardTaskReps = (): ReadonlyArray<TaskRep<FlashcardTaskAction>> => {
            const ref = Refs.create('1234', 'text-highlight');

            const createFrontAndBackAction = () => {
                const flashcard = Flashcards.createFrontBack('What is the capital of California? ', 'Sacramento', ref);
                const flashcardTaskActions = FlashcardTaskActions.create(flashcard);
                return flashcardTaskActions[0];
            };

            const createClozeAction = () => {
                const flashcard = Flashcards.createCloze('The capital of california is {{c1:Sacramento}}.', ref);
                const flashcardTaskActions = FlashcardTaskActions.create(flashcard);
                return flashcardTaskActions[0];
            };

            const tasks: ReadonlyArray<Task<FlashcardTaskAction>> = [
                {
                    id: "10102",
                    action: createClozeAction(),
                    created: ISODateTimeStrings.create(),
                    color: 'red',
                    mode: 'flashcard'
                },
                {
                    id: "10102",
                    action: createFrontAndBackAction(),
                    created: ISODateTimeStrings.create(),
                    color: 'red',
                    mode: 'flashcard'
                }
            ];

            return tasks.map(task => TasksCalculator.createInitialLearningState(task));

        };


        // const taskReps = createReadingTaskReps();
        const taskReps = createFlashcardTaskReps();

        return (

            <div>

                {/*<AnnotationTypeSelector selected={[AnnotationType.FLASHCARD]} onSelected={selected => console.log('selected: ', selected)}/>*/}

                {/*<ColorSelectorBox/>*/}

                {/*<StartReviewButton onClick={NULL_FUNCTION}/>*/}

                <LightModal>
                    <Reviewer taskReps={taskReps}
                              onRating={(id, answer) => console.log("got answer: ", id, answer)}
                              onSuspended={NULL_FUNCTION}
                              onFinished={() => console.log('finished')}/>
                </LightModal>

                {/*<div style={{width: '500px', height: '700px', display: 'flex'}}*/}
                {/*     className="border">*/}

                {/*    <Flashcard front={<div>front</div>}*/}
                {/*               back={<div>back</div>}*/}
                {/*               answers={<div>answers</div>}/>*/}

                {/*</div>*/}

                {/*<div className="border border-dark m-1" style={{width: '450px'}}>*/}
                {/*    <DocSidebar fingerprint="0x01" updated={ISODateTimeStrings.create()}/>*/}
                {/*</div>*/}

                {/*<div className="border border-dark m-1" style={{width: '450px'}}>*/}
                {/*    <DocSidebar fingerprint="0x01"*/}
                {/*                title="Bitcoin: A Peer-to-Peer Electronic Cash System"*/}
                {/*                subtitle="A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution."*/}
                {/*                authors={authors}*/}
                {/*                updated={ISODateTimeStrings.create()}*/}
                {/*                url='http://www.example.com/this/is/a/long-path/00000000000000000000000000000000000000000000000000.pdf'*/}
                {/*                published="2017"/>*/}
                {/*</div>*/}

                {/*<PDFViewer src="foo"/>*/}

                    {/*<LoadingProgress/>*/}

                {/*<MockFolderTree/>*/}

                {/*<AccountUpgradeBarView plan='free' accountUsage={{storageInBytes: 0}}/>*/}

                {/*<div>*/}

                {/*    /!*<LargeModal isOpen={true}*!/*/}
                {/*    /!*            centered={true}*!/*/}
                {/*    /!*            minWidth="20%">*!/*/}

                {/*    /!*    <LargeModalBody>*!/*/}

                {/*    /!*        this is some modal content.*!/*/}

                {/*    /!*        <GroupSearch/>*!/*/}

                {/*    /!*        <GroupHits>*!/*/}
                {/*    /!*            <GroupHit name="Linux" description="A group about Linux" nrMembers={10} onAdd={NULL_FUNCTION}/>*!/*/}
                {/*    /!*            <GroupHit name="Microsoft" description="A group about Microsoft" nrMembers={5} onAdd={NULL_FUNCTION}/>*!/*/}
                {/*    /!*        </GroupHits>*!/*/}

                {/*    /!*    </LargeModalBody>*!/*/}

                {/*    /!*    /!*<ModalFooter>*!/*!/*/}
                {/*    /!*    /!*    <Button color="primary" onClick={() => this.onDone()}>Close</Button>*!/*!/*/}
                {/*    /!*    /!*</ModalFooter>*!/*!/*/}


                {/*    /!*</LargeModal>*!/*/}


                {/*    <GroupCard group={group}/>*/}

                {/*</div>*/}

                {/*<TreeView root={root}*/}
                {/*          />*/}

                {/*<Dock side="left"*/}
                {/*      left={<Folders/>}*/}
                {/*      right={<Dock side="left"*/}
                {/*                   left={<Preview/>}*/}
                {/*                   right={<Main/>}/>}/>*/}


            </div>

        );
    }


}

interface IAppState {

}


