import {Divider, createStyles, makeStyles} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import {PlanPricingInterval} from "./PlansData";
import {PlansTableBody} from "./PlansTableBody";
import {PlansTableHeading} from "./PlansTableHeading";

export const usePlansTableStyles = makeStyles(() =>
    createStyles({
        root: {
            borderCollapse: "collapse",
            fontSize: 16,
        },
        checkCircle: {
            maxHeight: "24px",
        },
        header: {
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "28px",
            lineHeight: "33px",
            marginTop: "40px",
        },
        imgBox: {
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
        },
        rowHead: {
            textAlign: "left",
            width: '25%',
            padding: "7px 0px 7px 60px",
        },
        divider: {
            marginLeft: "4%",
            width: "92%",
        },
        row: {
            height: "55px",
            width: "65%",
            textAlign: 'center',
        },
        pricing: {
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "32px",
            lineHeight: "37px",
            letterSpacing: "0.15px",
            color: "#E0E0E0",
            margin: "20px 0",
        },
        subtitle: {
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "1.2em",
            lineHeight: "1.2em",
            textAlign: "center",
            letterSpacing: "0.15px",
            color: "#E0E0E0",
            paddingBottom: "10%",
        },
    })
);


export const PlansTableRowDivider = React.memo(function TableRowDivider() {

    const classes = usePlansTableStyles();

    return (
        <tr>
            <td colSpan={5}>
                <Divider className={classes.divider} />
            </td>
        </tr>
    );
});


interface IPlansTableProps {
    readonly pricingInterval: PlanPricingInterval;
    readonly className?: string;
    readonly style?: React.CSSProperties;
}

export const PlansTable: React.FC<IPlansTableProps> = React.memo((props) => {
    const { pricingInterval, className, style } = props;
    const classes = usePlansTableStyles();

    return (
        <table className={clsx(classes.root, className)} style={style}>
            <PlansTableHeading pricingInterval={pricingInterval} />
            <PlansTableBody />
        </table>
    );
});
