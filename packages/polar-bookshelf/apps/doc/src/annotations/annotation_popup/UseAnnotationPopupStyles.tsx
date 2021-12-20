import {createStyles, makeStyles} from "@material-ui/core";

export const useAnnotationPopupStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.secondary,
            background: theme.palette.background.paper,
            borderRadius: 4,
            boxSizing: "border-box",
        },
        barPadding: {
            padding: 8,
        },
        outer: {
            position: "absolute",
            willChange: "transform",
            top: 0,
            left: 0,
            zIndex: 10,
            "&.flipped .annotation_popup-inner": {
                flexDirection: "column-reverse",
            },
            "& .annotation_popup-inner": {
                flexDirection: "column",
            },
        },
        inner: {
            display: "flex",
            alignItems: "flex-start",
        }
    }),
);
