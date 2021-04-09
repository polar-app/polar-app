import * as React from "react"
import {PricingContent} from "polar-bookshelf/apps/repository/js/premium/PricingContent";
import {NullChangePlanContextProvider} from "polar-bookshelf/apps/repository/js/premium/actions/NullChangePlanContextProvider";
import Layout from "../components/layout";
import makeStyles from "@material-ui/styles/makeStyles";
import SEO from "../components/seo";
import {PricingStoreProvider} from "polar-bookshelf/apps/repository/js/premium/PricingStore";

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
            <SEO
                title="POLAR - Pricing"
                description="POLAR - Plus at $6.99 per month for 50GB of storage."
                lang="en"/>

            <div className={classes.root}>
                <PricingStoreProvider>
                    <NullChangePlanContextProvider>
                        <PricingContent/>
                    </NullChangePlanContextProvider>
                </PricingStoreProvider>
            </div>
        </Layout>
    );
};

export default Pricing;
