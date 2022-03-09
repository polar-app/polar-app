import React from "react";
import {Box, makeStyles, Paper} from "@material-ui/core";
import {PricingFAQ} from "./PricingFAQ";
import {PlansTable} from "../plans_table/PlansTable";
import {PlansIntervalToggle, usePricingIntervalFromHash} from "../plans_table/PlansIntervalToggle";

const useStyles = makeStyles({
  tableDesktopOuter: {
    display: "flex",
    justifyContent: "center",
    margin: "10px auto 10px",
    paddingBottom: 50,
    width: "80%",
    paddingRight: "25px",
  },

  tableDesktop: {
      width: '100%',
      maxWidth: 1300,
  },
});

export const PricingContentForDesktop = () => {
    
    const classes = useStyles();
    const interval = usePricingIntervalFromHash();

    return (
        <Box display="flex" flexDirection="column">
            <Box my="1em" mx="auto">
                <h1>Plans and Pricing</h1>
            </Box>

            <Box my="1em" mx="auto">
                <PlansIntervalToggle/>
            </Box>

            <Paper className={classes.tableDesktopOuter}>
                <PlansTable pricingInterval={interval} className={classes.tableDesktop} />
            </Paper>

            <Box mx="auto">
                <PricingFAQ/>
            </Box>
        </Box>
    );
}
