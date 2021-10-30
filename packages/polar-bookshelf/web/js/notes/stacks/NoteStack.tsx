import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {Theme, Box, createStyles, makeStyles} from "@material-ui/core";
import React from "react";
import {useLocation} from "react-router-dom";
import {BlockTargetStr} from "../NoteLinkLoader";
import {NoteStackItem, NoteStackItemWrapper, STACK_ITEM_BANNER_WIDTH, STACK_ITEM_WIDTH} from "./NoteStackItem";
import {NotesInnerContainer} from "../NotesContainer";
import {NoteStackProvider} from "./StackProvider";

export namespace NoteStackSearchParams {

    export function parse(search: string): ReadonlyArray<BlockTargetStr> {

        const params = new URLSearchParams(search);
        const stack = params.get('stack');

        if (! stack) {
            return [];
        }

        return stack.split(',');

    }

    export function replace(search: string,
                            sourceTarget: BlockTargetStr,
                            item: BlockTargetStr): string {

        const stack = parse(search);

        if (stack.length === 0) {
            return `stack=${item}`;
        }

        const idx = stack.indexOf(sourceTarget);


        if (idx === -1) {
            return "";
        }

        const newStack = [...stack.slice(0, idx + 1), item];

        return `stack=${newStack.join(',')}`

    }

}

interface INoteStacksStylesOpts {
    readonly active: boolean;
}

const useNoteStackStyles = makeStyles<Theme, INoteStacksStylesOpts>(() =>
    createStyles({
        root({ active }) {
            return {
                width: '100%',
                flex: 1,
                overflowX: 'auto',
                ...(active ? { justifyContent: 'flex-start' } : {}),
            };
        },
        stackRoot({ active }) {
            const width = active ? STACK_ITEM_WIDTH : '100%';

            return {
                width,
                minWidth: width,
                position: 'sticky',
                left: 0,
            };
        }
    }),
);

interface INoteStackProps {
    readonly target: BlockIDStr;
    readonly rootBannerLabel?: string;
}

export const NoteStack: React.FC<INoteStackProps> = (props) => {
    const { target, children, rootBannerLabel } = props;
    const { search } = useLocation();
    const [elem, setElem] = React.useState<HTMLDivElement | null>(null);
    
    const stack = React.useMemo((): ReadonlyArray<BlockIDStr> => {
        return NoteStackSearchParams.parse(search);
    }, [search]);

    const classes = useNoteStackStyles({ active: stack.length > 0 });
    
    const [hiddenUntil, setHiddenUntil] = React.useState<number>(0);

    React.useEffect(() => {
        if (! elem) {
            return;
        }

        const handleScroll = () => {
            const scroll = elem.scrollLeft;
            const hiddenUntil = Math.floor(scroll / (STACK_ITEM_WIDTH - STACK_ITEM_BANNER_WIDTH));

            setHiddenUntil(hiddenUntil);
            
        };

        elem.addEventListener('scroll', handleScroll, { passive: true });

        return () => elem.removeEventListener('scroll', handleScroll);
    }, [elem, setHiddenUntil]);

    const getItem = React.useCallback((target: BlockTargetStr, index: number) => (
        <NoteStackItemWrapper target={decodeURIComponent(target)}
                              key={`${target}-${index}`}
                              index={index}
                              hidden={hiddenUntil > (index + 1)}>
            <NoteStackItem target={target} />
        </NoteStackItemWrapper>
    ), [hiddenUntil]);

    if (stack.length === 0) {
        return (
            <NotesInnerContainer>
                <NoteStackProvider target={target} children={children} />
            </NotesInnerContainer>
        );
    }

    return (
        <NotesInnerContainer className={classes.root} ref={setElem}>
            <Box display="flex" justifyContent="center" className={classes.stackRoot}>
                <NoteStackItemWrapper hidden={hiddenUntil > 0}
                                      bannerLabel={rootBannerLabel}
                                      index={0}
                                      target={target}>
                    <NoteStackProvider target={target} children={children} />
                </NoteStackItemWrapper>
            </Box>
            {stack.map(getItem)}
        </NotesInnerContainer>
    );
};
