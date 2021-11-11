import React from "react";
import {IDStr} from "polar-shared/src/util/Strings";
import {NoteButton} from "./NoteButton";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {observer} from "mobx-react-lite"
import {useBlocksTreeStore} from "./BlocksTree";
import clsx from "clsx";
import {Box} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.primary
        },
    }),
);

interface IProps {
    readonly id: IDStr;
    readonly style?: React.CSSProperties;
    readonly className?: string;
}

interface IExpandButtonProps {
    readonly expanded: boolean;
    readonly onToggle: () => void;
    readonly style?: React.CSSProperties;
    readonly className?: string;
}

export const ExpandToggle: React.FC<IExpandButtonProps> = (props) => {
    const { expanded, onToggle, className = "", style = {} } = props;
    const classes = useStyles();

    return (
        <NoteButton className={clsx(classes.root, className)}
                    style={{ ...style }}
                    // To prevent losing focus of the focused block
                    onMouseDown={e => e.preventDefault()}
                    onClick={onToggle}>
            <Box display="flex" alignItems="center">
                <ChevronRightIcon
                    style={{
                        transform: `rotate(${expanded ? 90 : 0}deg)`,
                        transformOrigin: 'center',
                        fontSize: 16,
                        transition: 'transform 100ms ease-in',
                    }}
                />
            </Box>
        </NoteButton>
    );
};

export const BlockExpandToggleButton = observer(function NoteExpandToggleButton(props: IProps) {

    const {id, className, style} = props;

    const blocksTreeStore = useBlocksTreeStore();

    const expanded = blocksTreeStore.isExpanded(props.id);

    const onToggle = React.useCallback(() => blocksTreeStore.toggleExpand(id), [id, blocksTreeStore]);

    return <ExpandToggle expanded={expanded} onToggle={onToggle} className={className} style={style} />;

});
