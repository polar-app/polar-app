import React from 'react';
import {BlockTextContentUtils, namedBlocksComparator} from "../../../../web/js/notes/NoteUtils";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {BaseR, Order} from "./TableGridStore";
import {NotesRepoContextMenu} from "./NotesRepoContextMenu";
import {Comparators} from "polar-shared/src/util/Comparators";
import {IBlock, INamedContent} from "polar-blocks/src/blocks/IBlock";
import {createTableGrid} from "./TableGrid";
import Comparator = Comparators.Comparator;

export interface INotesRepoRow {
    readonly title: string;
    readonly created: ISODateTimeString,
    readonly updated: ISODateTimeString,
    readonly id: string;
}

export const [NotesRepoTable2] = createTableGrid({
    ContextMenu: NotesRepoContextMenu,
    comparatorFactory,
    order: 'asc',
    orderBy: 'title',
    columnDescriptors: [
        { id: 'title', type: 'text', disablePadding: true, label: 'Title', defaultLabel: "Untitled", width: 'auto', defaultOrder: 'asc' },
        { id: 'created', type: 'date', disablePadding: true, label: 'Created', width: '7em', defaultOrder: 'desc', devices: ['desktop', 'tablet'] },
        { id: 'updated', type: 'date', disablePadding: true, label: 'Updated', width: '7em', defaultOrder: 'desc', devices: ['desktop', 'tablet'] },
    ],
    toRow
})

// createTableGrid<IBlock<INamedContent>, INotesRepoRow>>({
// });
//

//
// export const NotesRepoTable2 = observer(function NotesRepoTable2() {
//
//     const blocksStore = useBlocksStore();
//     const noteLinkLoader = useNoteLinkLoader();
//     const tableGridStore = useTableGridStore();
//
//     const {view} = tableGridStore;
//
//     React.useEffect(() => {
//         tableGridStore.setOpener(id => noteLinkLoader(id))
//     }, [tableGridStore, noteLinkLoader])
//
//     const data = React.useMemo(() => blocksStore.namedBlocks, [blocksStore.namedBlocks]);
//
//     React.useEffect(() => {
//         tableGridStore.setData(data);
//     }, [tableGridStore, data]);
//
//     const [root, setRoot] = React.useState<HTMLElement | HTMLDivElement | null>();
//
//     return (
//
//         <MUIElevation elevation={0}
//                       style={{
//                           width: '100%',
//                           height: '100%',
//                           display: 'flex',
//                           flexDirection: 'column'
//                       }}>
//
//             <>
//
//                 <NotesRepoTableToolbar />
//
//                 <TableContainer ref={setRoot}
//                                 style={{
//                                     flexGrow: 1,
//                                     // height: Devices.isDesktop()? '100%':'calc(100% - 124px)'
//                                     height: '100%',
//                                     overflowX: 'hidden'
//                                 }}>
//                     <Table
//                         stickyHeader
//                         style={{
//                             minWidth: 0,
//                             maxWidth: '100%',
//                             tableLayout: 'fixed'
//                         }}
//                         aria-labelledby="tableTitle"
//                         size={'medium'}
//                         aria-label="enhanced table">
//
//                         <NotesRepoTableHead/>
//
//                         <NotesRepoContextMenuProvider>
//                             {root && (
//                                 <IntersectionList values={view}
//                                                   root={root}
//                                                   blockSize={25}
//                                                   BlockComponent={DocRepoBlockComponent}
//                                                   HiddenBlockComponent={HiddenBlockComponent}
//                                                   VisibleComponent={VisibleComponent}/>)}
//                         </NotesRepoContextMenuProvider>
//
//                     </Table>
//                 </TableContainer>
//             </>
//
//         </MUIElevation>
//     );
//
// });


function toRow(data: IBlock<INamedContent>): INotesRepoRow {

    return {
        title: BlockTextContentUtils.getTextContentMarkdown(data.content),
        created: data.created,
        id: data.id,
        updated: data.updated,
    }

}

function createComparator<R extends BaseR>(field: keyof INotesRepoRow): Comparator<IBlock<INamedContent>> {

    switch (field) {

        case "title":
            return (a: IBlock<INamedContent>, b: IBlock<INamedContent>) => {
                return namedBlocksComparator(a, b);
            }
        case "created":
            return (a: IBlock<INamedContent>, b: IBlock<INamedContent>) => {
                return a.created.localeCompare(b.created);
            }
        case "updated":
            return (a: IBlock<INamedContent>, b: IBlock<INamedContent>) => {
                return a.updated.localeCompare(b.updated);
            }
        case "id":
            return (a: IBlock<INamedContent>, b: IBlock<INamedContent>) => {
                return a.id.localeCompare(b.id);
            }

    }

}

function comparatorFactory(field: keyof INotesRepoRow, order: Order): Comparator<IBlock<INamedContent>> {
    const comparator = createComparator(field);
    return order === 'asc' ? comparator : Comparators.reverse(comparator);
}
