import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {usePricingCallbacks, usePricingStore} from "./PricingStore";
import React from "react";
import Button from "@material-ui/core/Button";

export const PlanIntervalButton = deepMemo(() => {

    const {interval} = usePricingStore(['interval']);
    const {toggleInterval} = usePricingCallbacks();

    return (
        <Button color="secondary"
                variant="contained"
                onClick={toggleInterval}>

            Show {interval === 'month' ? 'Yearly' : 'Monthly'} Plans

        </Button>
    );

});
