import * as React from "react"
import {PricingContent} from "polar-bookshelf/apps/repository/js/premium/PricingContent";
import {NullChangePlanContextProvider} from "polar-bookshelf/apps/repository/js/premium/actions/NullChangePlanContextProvider";
import Layout from "../components/layout";
import makeStyles from "@material-ui/styles/makeStyles";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
    },
});

const Pricing = () => {

    const classes = useStyles()

    return (
        <Layout>
            <div className={classes.root}>
                <NullChangePlanContextProvider>
                    <PricingContent/>
                </NullChangePlanContextProvider>
            </div>
        </Layout>
    );
};

export default Pricing;
