import React from "react";
import {IDStr} from "polar-shared/src/util/Strings";
import {NoteButton} from "./NoteButton";
import {ArrowRight} from "./ArrowRight";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import createStyles from "@material-ui/core/styles/createStyles";
import {observer} from "mobx-react-lite"
import {useBlocksTreeStore} from "./BlocksTree";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.primary
        },
    }),
);

interface IProps {
    readonly id: IDStr;
}

interface IExpandButtonProps {
    expanded: boolean;
    onToggle: () => void;
    style?: React.CSSProperties;
    className?: string;
}

export const ExpandToggle: React.FC<IExpandButtonProps> = (props) => {
    const { expanded, onToggle, className = "", style = {} } = props;
    const classes = useStyles();

    return (
        <NoteButton className={clsx(classes.root, className)}
                    style={{ ...style, fontSize: 20 }}
                    onClick={onToggle}>
            <ArrowRightIcon
                style= {{
                    transform: `rotate(${expanded ? 90 : 0}deg)`,
                    transformOrigin: 'center',
                    transition: 'transform 100ms ease-in',
                }}
            />
        </NoteButton>
    );
};

export const BlockExpandToggleButton = observer(function NoteExpandToggleButton(props: IProps) {

    const {id} = props;

    const blocksTreeStore = useBlocksTreeStore();

    const expanded = blocksTreeStore.isExpanded(props.id);

    const onToggle = React.useCallback(() => blocksTreeStore.toggleExpand(id), [id, blocksTreeStore]);

    return <ExpandToggle expanded={expanded} onToggle={onToggle} />;

});
