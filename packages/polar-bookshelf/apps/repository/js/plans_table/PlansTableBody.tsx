import React from "react";
import clsx from "clsx";
import {PLAN_FEATURE_LABELS} from "./PlansData";
import {PLANS} from "./PlansData";
import {PlanFeature} from "./PlansData";
import {usePlansTableStyles} from "./PlansTable";
import {PlansTableFeatureValue} from "./PlansTableFeatureValue";

export const PlansTableBody: React.FC = React.memo(() => {
    const classes = usePlansTableStyles();

    return (
        <tbody>
            {Object.keys(PlanFeature).map((feat) => {
                const featKey = feat as PlanFeature;

                return (
                    <React.Fragment key={featKey}>
                        <tr className={clsx(classes.row, 'with-border')}>
                            <td className={classes.rowHead}>{PLAN_FEATURE_LABELS[featKey]}</td>

                            {Object.values(PLANS).map(({ features, label }) => (
                                <td key={label}><PlansTableFeatureValue value={features[featKey]} /></td>
                            ))}
                        </tr>
                    </React.Fragment>
                );
            })}
        </tbody>
    );
});
