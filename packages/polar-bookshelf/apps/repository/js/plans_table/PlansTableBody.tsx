import React from "react";
import {PLAN_FEATURE_LABELS} from "./PlansData";
import {PLANS} from "./PlansData";
import {PlanFeature} from "./PlansData";
import {PlansTableRowDivider, usePlansTableStyles} from "./PlansTable";
import {PlansTableFeatureValue} from "./PlansTableFeatureValue";

export const PlansTableBody: React.FC = React.memo(() => {
    const classes = usePlansTableStyles();

    return (
        <tbody>
            {Object.keys(PlanFeature).map((feat) => {
                const featKey = feat as PlanFeature;

                return (
                    <>
                        <PlansTableRowDivider />
                        <tr className={classes.row}>
                            <td className={classes.rowHead}>{PLAN_FEATURE_LABELS[featKey]}</td>

                            {PLANS.map(({ features }) => (
                                <td><PlansTableFeatureValue value={features[featKey]} /></td>
                            ))}
                        </tr>
                    </>
                );
            })}
        </tbody>
    );
});
