import * as React from "react";
import TableCell from "@material-ui/core/TableCell";
import Box from "@material-ui/core/Box";
import {AnnotationPreview} from "./AnnotationPreview";
import TableRow from "@material-ui/core/TableRow";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {useAnnotationRepoCallbacks} from "./AnnotationRepoStore";
import {IDStr} from "polar-shared/src/util/Strings";
import isEqual from "react-fast-compare";

interface IProps {
    readonly viewIndex: number;
    readonly rowSelected: boolean;
    readonly annotation: IDocAnnotation;
}

export const AnnotationRepoTableRow = React.memo((props: IProps) => {
    const {viewIndex, annotation, rowSelected} = props;

    const callbacks = useAnnotationRepoCallbacks();
    const {onDragStart, onDragEnd, setPage, setRowsPerPage} = callbacks;

    const handleSelect = React.useCallback((selectedID: IDStr, event: React.MouseEvent) => {
        callbacks.selectRow(selectedID, event, 'click');
    }, [callbacks]);

    return (
        <TableRow key={viewIndex}
                  hover
                  role="checkbox"
                  onClick={(event) => handleSelect(annotation.id, event)}
                  draggable
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  selected={rowSelected}>

            <TableCell padding="checkbox">
                <Box p={1}>
                    <AnnotationPreview id={annotation.id}
                                       text={annotation.text}
                                       img={annotation.img}
                                       color={annotation.color}
                                       lastUpdated={annotation.lastUpdated}
                                       created={annotation.created}/>
                </Box>
            </TableCell>
        </TableRow>
    );
}, isEqual);
