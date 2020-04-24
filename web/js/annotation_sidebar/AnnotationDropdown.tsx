import * as React from 'react';
import {DocAnnotation} from './DocAnnotation';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {MUIDropdownMenu} from "../../spectron0/material-ui/dropdown_menu/MUIDropdownMenu";

import MoreVertIcon from "@material-ui/icons/MoreVert";
import {MUIDropdownItem} from "../../spectron0/material-ui/dropdown_menu/MUIDropdownItem";
import CommentIcon from '@material-ui/icons/Comment';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import {ConfirmDialogProps} from '../ui/dialogs/ConfirmDialog';
import {
    DialogManager,
    MUIDialogController
} from "../../spectron0/material-ui/dialogs/MUIDialogController";

interface IProps {
    readonly id: string;
    readonly annotation: DocAnnotation;
    readonly onDelete: (annotation: DocAnnotation) => void;
    readonly onJumpToContext: (annotation: DocAnnotation) => void;
    readonly onCreateComment: (annotation: DocAnnotation) => void;
    readonly onCreateFlashcard: (annotation: DocAnnotation) => void;
    readonly disabled?: boolean;
}

export const AnnotationDropdown = (props: IProps) => {

    const handleDelete = (dialogs: DialogManager) => {

        const confirmProps: ConfirmDialogProps = {
            title: "Are you sure you want to delete this annotation? ",
            subtitle: "This will also delete all associated comments and flashcards.",
            type: 'danger',
            onCancel: NULL_FUNCTION,
            onAccept: () => props.onDelete(props.annotation)
        };

        dialogs.confirm(confirmProps);

    };

    return (

        <MUIDialogController>
            {(dialogs) => (

                <>

                    <MUIDropdownMenu button={{
                                         icon: <MoreVertIcon/>,
                                         disabled: props.disabled,
                                         size: 'small'
                                     }}
                                     placement='bottom-end'>
                        <div>

                            {/*TODO: for now don't create the same items as the toolbar */}

                            <MUIDropdownItem text="Create comment"
                                             icon={<CommentIcon/>}
                                             onClick={() => props.onCreateComment(props.annotation)}/>

                            <Divider/>

                            <MUIDropdownItem text="Delete"
                                             icon={<DeleteIcon/>}
                                             onClick={() => handleDelete(dialogs)}/>
                        </div>
                    </MUIDropdownMenu>

                </>
            )}
        </MUIDialogController>

    );
};

//
//     <Dropdown id={this.props.id}
//               isOpen={this.state.open}
//               toggle={this.toggle}>
//

//
//             <DropdownItem style={Styles.DropdownItem} onClick={() => this.onCreateFlashcard()}>
//                 Create flashcard
//             </DropdownItem>
//
//             <DropdownItem style={Styles.DropdownItem} onClick={() => this.onJumpToContext()}>
//                 Jump to context
//             </DropdownItem>
//
//             <DropdownItem divider />
//
//             <DropdownItem style={Styles.DropdownItem}
//                           className="text-danger"
//                           disabled={this.props.annotation.immutable}
//                           onClick={() => this.onDeleteSelected()}>
//                 Delete
//             </DropdownItem>
//
//         </DropdownMenu>
//
//
//     </Dropdown>
//
// </div>

// );
