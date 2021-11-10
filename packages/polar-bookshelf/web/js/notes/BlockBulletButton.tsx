import React from "react";
import {MiddleDot} from "./MiddleDot";
import {BlockTargetStr} from "./NoteLinkLoader";
import {NoteButton} from "./NoteButton";
import {observer} from "mobx-react-lite"
import {NoteLink} from "./NoteLink";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import useTheme from "@material-ui/core/styles/useTheme";
import {useBlocksTreeStore} from "./BlocksTree";


interface IProps {
    readonly target: BlockTargetStr;
    readonly style?: React.CSSProperties;
    readonly className?: string;
}

export const BlockBulletButton = observer(function NoteBulletButton(props: IProps) {
    const theme = useTheme();
    const {root} = useBlocksTreeStore();

    const disabled = root === props.target;

    // ev.dataTransfer.setData("text/plain", ev.target.id);

    return (
        <NoteButton className={props.className} onClick={NULL_FUNCTION}
                    disabled={disabled}>
            <NoteLink target={props.target}
                      className={props.className}
                      style={{
                          ...props.style,
                          color: theme.palette.text.primary,
                          textDecoration: 'none',
                          fontSize: '20px',
                          lineHeight: '20px',
                          textAlign: 'center',
                      }}
                      draggable>
                    <MiddleDot/>
            </NoteLink>
        </NoteButton>
    );
})

