import {Box} from "@material-ui/core";
import React from "react";
import {FATimesCircleIcon} from "../../../../web/js/icons/FontAwesomeIcons";
import {PlanCheckIcon} from "../premium/PlanCheckIcon";
import {usePlansTableStyles} from "./PlansTable";


interface IFeatureValueProps {
    readonly value: string | boolean;
}

export const PlansTableFeatureValue: React.FC<IFeatureValueProps> = React.memo(({ value }) => {
    const classes = usePlansTableStyles();

    switch (typeof value) {
        case 'boolean':
            return (
                <Box className={classes.imgBox}>
                    {value
                        ? <PlanCheckIcon />
                        : (
                            <Box className={classes.imgBox}>
                                <FATimesCircleIcon className={classes.checkCircle} />
                            </Box>
                        )
                    }
                </Box>
            );
        case 'string':
            return <>{value}</>;
    }
});
