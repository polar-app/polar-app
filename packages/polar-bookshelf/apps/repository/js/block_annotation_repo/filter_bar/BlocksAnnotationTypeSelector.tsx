import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import React from "react";
import {IconWithColor} from "../../../../../web/js/ui/IconWithColor";
import NoteIcon from '@material-ui/icons/Note';
import {IRepoAnnotationContent} from "../BlocksAnnotationRepoStore";
import {MUIMenu} from "../../../../../web/js/mui/menu/MUIMenu";
import {AnnotationTypeMenuItem} from "../../annotation_repo/filter_bar/controls/annotation_type/AnnotationTypeMenuItem";


type DropdownOption = {
    readonly id: IRepoAnnotationContent['type'];
    readonly label: string;
}

const options: ReadonlyArray<DropdownOption> = [
    {
        id: AnnotationContentType.TEXT_HIGHLIGHT,
        label: 'Text Highlight'
    },
    {
        id: AnnotationContentType.AREA_HIGHLIGHT,
        label: 'Area Highlight'
    },
    {
        id: 'markdown',
        label: 'Comment'
    },
    {
        id: AnnotationContentType.FLASHCARD,
        label: 'Flashcard'
    },

];

interface IProps {

    readonly selected: ReadonlyArray<IRepoAnnotationContent['type']>;

    readonly onSelected: (selected: ReadonlyArray<IRepoAnnotationContent['type']>) => void;

}

export const BlocksAnnotationTypeSelector: React.FC<IProps> = ({ selected, onSelected }) => {

    return (
        <MUIMenu caret
                 button={{
                     text: "Annotations",
                     variant: 'outlined',
                     icon: <IconWithColor color="text.secondary" Component={NoteIcon}/>,
                 }}>

            <div>
                {options.map((current, idx) => {

                    const isSelected = selected.includes(current.id);

                    const computeNewSelected = () => {
                        const newSelected = isSelected ?
                            selected.filter(item => item !== current.id) :
                            [...selected, current.id];

                        return newSelected;

                    };

                    const newSelected = computeNewSelected();

                    const onClick = () => onSelected(newSelected);

                    return (
                        <AnnotationTypeMenuItem key={idx}
                                                selected={isSelected}
                                                onClick={onClick}>
                            {current.label}
                        </AnnotationTypeMenuItem>
                    );

                })}
            </div>

        </MUIMenu>
    );
};
