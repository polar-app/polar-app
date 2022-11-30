import * as React from "react"
import Nav from "./nav";
import {Box, CssBaseline} from "@material-ui/core";
import {Helmet} from "react-helmet";
import Footer from "./footer";
import {PropsWithChildren} from "react";

interface LayoutProps extends PropsWithChildren<unknown> {
    noHeader: boolean,
}

const Layout = (props: LayoutProps) => {
    return (
        <React.Fragment>
            <Helmet>
                <CssBaseline/>
            </Helmet>
            {props.noHeader || <Nav/>}
            {props.children}
            <Box style={{paddingBottom: "0px", width: "100%", bottom: 0}}>
                <Footer/>
            </Box>
        </React.Fragment>
    );
};

export const LayoutDocs = ({children}) => {
    return (
        <React.Fragment>
            <Helmet>
                <CssBaseline/>
            </Helmet>
            <Nav/>
            {children}
        </React.Fragment>
    );
};

export default Layout;
