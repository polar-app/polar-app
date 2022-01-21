import React from "react";
import Header from "./Header";

const Layout: React.FC = ({children}) => {
    return <>
        <Header/>
        <main>{children}</main>
    </>
}
export default Layout;
