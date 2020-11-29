import * as React from "react"
import {PricingContent} from "polar-bookshelf/apps/repository/js/premium/PricingContent";
import {NullChangePlanContextProvider} from "polar-bookshelf/apps/repository/js/premium/actions/NullChangePlanContextProvider";
import Layout from "../components/layout";
import makeStyles from "@material-ui/styles/makeStyles";
import SEO from "../components/seo";

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

            {/*<BrowserRouter>*/}
            {/*    <Switch>*/}
            {/*        <Route path="/pricing">*/}
                        <div className={classes.root}>
                            <NullChangePlanContextProvider>
                                <PricingContent/>
                            </NullChangePlanContextProvider>
                        </div>
            {/*        </Route>*/}
            {/*    </Switch>*/}
            {/*</BrowserRouter>*/}
        </Layout>
    );
};

export default Pricing;
