import * as React from 'react';
import {Tags} from 'polar-shared/src/tags/Tags';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Group} from "../../js/datastore/sharing/db/Groups";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {ManualDropdown} from "../../../apps/repository/js/doc_repo/ManaulDropdown";
import DropdownItem from 'reactstrap/lib/DropdownItem';
import {DropdownMenu, DropdownToggle, Input} from "reactstrap";
import {FakePopup} from "./FakePopup";
import { BasicPopup } from './BasicPopup';
import { PDFViewer } from './PDFViewer';
import {DocSidebar} from "./DocSidebar";
import {
    Task,
    TaskRep,
    TasksCalculator
} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Reviewer} from "../../../apps/repository/js/reviewer/Reviewer";
import {LightModal} from "../../js/ui/LightModal";
import {StartReviewButton} from "../../../apps/repository/js/annotation_repo/filter_bar/StartReviewButton";

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

        const lorem = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec faucibus ligula. Ut nec consectetur nisi, in euismod ipsum. Curabitur euismod ipsum in enim varius consequat. Ut ligula justo, tristique in lacus non, imperdiet euismod tortor. Integer efficitur euismod erat a malesuada. Aliquam erat volutpat. Morbi ut tempus est. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque efficitur est magna, quis pharetra ex hendrerit quis.

Proin tincidunt, quam eu ornare vehicula, nisl ipsum iaculis massa, ut sollicitudin leo nisl at sem. Mauris molestie nunc nec nisl sollicitudin, a venenatis ex dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies, odio at viverra dapibus, ligula ex vulputate libero, sed maximus velit sem et nibh. In hac habitasse platea dictumst. Aliquam aliquam eros eget cursus interdum. Etiam eros mauris, condimentum eget odio ut, convallis tempor turpis.

Curabitur quis luctus quam, in fermentum ipsum. Nullam a consequat lectus. Nulla consectetur, diam luctus placerat accumsan, velit sapien porttitor sem, nec feugiat est elit ac odio. Duis condimentum, arcu id venenatis convallis, metus mi pellentesque magna, nec rutrum nulla sapien sit amet libero. In pretium sodales accumsan. Vivamus pulvinar pretium arcu quis lacinia. Vestibulum sed interdum diam. Aenean id rhoncus ligula, non pretium nisl. Etiam ut nisl volutpat, pharetra nisi sed, facilisis sem. Fusce eget orci nunc. Vivamus iaculis auctor sapien ornare accumsan. Morbi tempus ornare sapien nec consectetur. Maecenas interdum mollis porta. In leo orci, ultrices in ornare ut, dignissim et erat. Quisque eu eros quis justo faucibus porttitor. Phasellus ac rutrum nunc.

Nullam auctor porttitor diam, in aliquam ante. Sed iaculis felis in lorem varius, in molestie velit ultricies. Morbi lectus tellus, condimentum vel sollicitudin et, aliquet eget nibh. In nunc neque, gravida vitae malesuada nec, hendrerit non enim. Integer a volutpat odio. Aliquam non pretium massa, non sagittis augue. Praesent pellentesque vitae ex non efficitur. Donec vel ultricies mauris, nec fermentum metus. Phasellus rutrum libero odio. Duis eu feugiat mi. Vivamus non orci erat. Donec ac ante ac sapien pellentesque commodo convallis a eros. Quisque ultrices, nibh ac maximus congue, purus risus tempus nisl, vitae tempor dui sapien id lacus. Phasellus leo orci, iaculis nec tristique ut, venenatis a nunc. Proin ac accumsan tellus.

Vivamus ullamcorper massa vitae dui placerat, et vehicula odio sollicitudin. Nulla gravida et mauris vel aliquam. Praesent tristique ipsum sem, et pulvinar nulla hendrerit a. In nec felis eget lacus dapibus lobortis. Vestibulum finibus odio et metus eleifend, luctus elementum neque consectetur. Phasellus at eros metus. Sed lacinia tellus at nisl cursus pretium. Duis molestie pulvinar urna, eget bibendum ante accumsan et. Vestibulum eu convallis massa. Fusce ut urna erat.        

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec faucibus ligula. Ut nec consectetur nisi, in euismod ipsum. Curabitur euismod ipsum in enim varius consequat. Ut ligula justo, tristique in lacus non, imperdiet euismod tortor. Integer efficitur euismod erat a malesuada. Aliquam erat volutpat. Morbi ut tempus est. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque efficitur est magna, quis pharetra ex hendrerit quis.

Proin tincidunt, quam eu ornare vehicula, nisl ipsum iaculis massa, ut sollicitudin leo nisl at sem. Mauris molestie nunc nec nisl sollicitudin, a venenatis ex dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies, odio at viverra dapibus, ligula ex vulputate libero, sed maximus velit sem et nibh. In hac habitasse platea dictumst. Aliquam aliquam eros eget cursus interdum. Etiam eros mauris, condimentum eget odio ut, convallis tempor turpis.

Curabitur quis luctus quam, in fermentum ipsum. Nullam a consequat lectus. Nulla consectetur, diam luctus placerat accumsan, velit sapien porttitor sem, nec feugiat est elit ac odio. Duis condimentum, arcu id venenatis convallis, metus mi pellentesque magna, nec rutrum nulla sapien sit amet libero. In pretium sodales accumsan. Vivamus pulvinar pretium arcu quis lacinia. Vestibulum sed interdum diam. Aenean id rhoncus ligula, non pretium nisl. Etiam ut nisl volutpat, pharetra nisi sed, facilisis sem. Fusce eget orci nunc. Vivamus iaculis auctor sapien ornare accumsan. Morbi tempus ornare sapien nec consectetur. Maecenas interdum mollis porta. In leo orci, ultrices in ornare ut, dignissim et erat. Quisque eu eros quis justo faucibus porttitor. Phasellus ac rutrum nunc.

Nullam auctor porttitor diam, in aliquam ante. Sed iaculis felis in lorem varius, in molestie velit ultricies. Morbi lectus tellus, condimentum vel sollicitudin et, aliquet eget nibh. In nunc neque, gravida vitae malesuada nec, hendrerit non enim. Integer a volutpat odio. Aliquam non pretium massa, non sagittis augue. Praesent pellentesque vitae ex non efficitur. Donec vel ultricies mauris, nec fermentum metus. Phasellus rutrum libero odio. Duis eu feugiat mi. Vivamus non orci erat. Donec ac ante ac sapien pellentesque commodo convallis a eros. Quisque ultrices, nibh ac maximus congue, purus risus tempus nisl, vitae tempor dui sapien id lacus. Phasellus leo orci, iaculis nec tristique ut, venenatis a nunc. Proin ac accumsan tellus.

Vivamus ullamcorper massa vitae dui placerat, et vehicula odio sollicitudin. Nulla gravida et mauris vel aliquam. Praesent tristique ipsum sem, et pulvinar nulla hendrerit a. In nec felis eget lacus dapibus lobortis. Vestibulum finibus odio et metus eleifend, luctus elementum neque consectetur. Phasellus at eros metus. Sed lacinia tellus at nisl cursus pretium. Duis molestie pulvinar urna, eget bibendum ante accumsan et. Vestibulum eu convallis massa. Fusce ut urna erat.        \`;

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec faucibus ligula. Ut nec consectetur nisi, in euismod ipsum. Curabitur euismod ipsum in enim varius consequat. Ut ligula justo, tristique in lacus non, imperdiet euismod tortor. Integer efficitur euismod erat a malesuada. Aliquam erat volutpat. Morbi ut tempus est. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque efficitur est magna, quis pharetra ex hendrerit quis.

Proin tincidunt, quam eu ornare vehicula, nisl ipsum iaculis massa, ut sollicitudin leo nisl at sem. Mauris molestie nunc nec nisl sollicitudin, a venenatis ex dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultricies, odio at viverra dapibus, ligula ex vulputate libero, sed maximus velit sem et nibh. In hac habitasse platea dictumst. Aliquam aliquam eros eget cursus interdum. Etiam eros mauris, condimentum eget odio ut, convallis tempor turpis.

Curabitur quis luctus quam, in fermentum ipsum. Nullam a consequat lectus. Nulla consectetur, diam luctus placerat accumsan, velit sapien porttitor sem, nec feugiat est elit ac odio. Duis condimentum, arcu id venenatis convallis, metus mi pellentesque magna, nec rutrum nulla sapien sit amet libero. In pretium sodales accumsan. Vivamus pulvinar pretium arcu quis lacinia. Vestibulum sed interdum diam. Aenean id rhoncus ligula, non pretium nisl. Etiam ut nisl volutpat, pharetra nisi sed, facilisis sem. Fusce eget orci nunc. Vivamus iaculis auctor sapien ornare accumsan. Morbi tempus ornare sapien nec consectetur. Maecenas interdum mollis porta. In leo orci, ultrices in ornare ut, dignissim et erat. Quisque eu eros quis justo faucibus porttitor. Phasellus ac rutrum nunc.

Nullam auctor porttitor diam, in aliquam ante. Sed iaculis felis in lorem varius, in molestie velit ultricies. Morbi lectus tellus, condimentum vel sollicitudin et, aliquet eget nibh. In nunc neque, gravida vitae malesuada nec, hendrerit non enim. Integer a volutpat odio. Aliquam non pretium massa, non sagittis augue. Praesent pellentesque vitae ex non efficitur. Donec vel ultricies mauris, nec fermentum metus. Phasellus rutrum libero odio. Duis eu feugiat mi. Vivamus non orci erat. Donec ac ante ac sapien pellentesque commodo convallis a eros. Quisque ultrices, nibh ac maximus congue, purus risus tempus nisl, vitae tempor dui sapien id lacus. Phasellus leo orci, iaculis nec tristique ut, venenatis a nunc. Proin ac accumsan tellus.

Vivamus ullamcorper massa vitae dui placerat, et vehicula odio sollicitudin. Nulla gravida et mauris vel aliquam. Praesent tristique ipsum sem, et pulvinar nulla hendrerit a. In nec felis eget lacus dapibus lobortis. Vestibulum finibus odio et metus eleifend, luctus elementum neque consectetur. Phasellus at eros metus. Sed lacinia tellus at nisl cursus pretium. Duis molestie pulvinar urna, eget bibendum ante accumsan et. Vestibulum eu convallis massa. Fusce ut urna erat.        \`;

`;

        const tasks: ReadonlyArray<Task> = [
            {
                id: "10102",
                text: lorem,
                created: ISODateTimeStrings.create(),
                color: 'red'
            },
            {
                id: "10101",
                text: "this is the first one",
                created: ISODateTimeStrings.create(),
                color: 'yellow'
            },
            {
                id: "10102",
                text: "this is the second one",
                created: ISODateTimeStrings.create(),
                color: 'yellow'
            },
        ];

        const taskReps = tasks.map(task => TasksCalculator.createInitialLearningState(task));

        const authors = [
            {displayName: 'Alice Smith'},
            {displayName: 'John Barnes'}
        ];

        return (

            <div style={{margin: '5px'}}>

                {/*<StartReviewButton onClick={NULL_FUNCTION}/>*/}

                <LightModal>
                    <Reviewer taskReps={taskReps}
                              onAnswer={(id, answer) => console.log("got answer: ", id, answer)}
                              onSuspended={NULL_FUNCTION}
                              onFinished={() => console.log('finished')}/>
                </LightModal>

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


