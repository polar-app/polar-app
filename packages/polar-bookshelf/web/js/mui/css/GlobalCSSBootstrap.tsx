/* tslint:disable:label-position */
import withStyles from "@material-ui/core/styles/withStyles";
import {GlobalCssSummernoteStyles} from "./GlobalCssSummernote";

/**
 * Basic "gap box" for having easy / uniform margins between sub-components
 * just via a CSS property.
 */
const GlobalCSSBootstrapStyles = withStyles({
    // @global is handled by jss-plugin-global.
    '@global': {

        ".text-right": {
            textAlign: "right"
        },

        ".text-center": {
            textAlign: "center"
        },

        "font-weight-bold": {
            fontWeight: 'bold'
        },

        ".m-1": { margin: "5px" },
        ".mt-1": { marginTop: "5px" },
        ".mb-1": { marginBottom: "5px" },
        ".ml-1": { marginLeft: "5px" },
        ".mr-1": { marginRight: "5px" },
        ".m-auto": { margin: "auto" },
        ".ml-auto": { marginLeft: "auto" },
        ".mr-auto": { marginRight: "auto" },
        ".mt-auto": { marginTop: "auto" },
        ".mb-auto": { marginBottom: "auto" },
        ".m-2": { margin: "10px" },
        ".mt-2": { marginTop: "10px" },
        ".mb-2": { marginBottom: "10px" },
        ".ml-2": { marginLeft: "10px" },
        ".mr-2": { marginRight: "10px" },
        ".m-3": { margin: "15px" },
        ".mt-3": { marginTop: "15px" },
        ".mb-3": { marginBottom: "15px" },
        ".ml-3": { marginLeft: "15px" },
        ".mr-3": { marginRight: "15px" },
        ".m-4": { margin: "20px" },
        ".mt-4": { marginTop: "20px" },
        ".mb-4": { marginBottom: "20px" },
        ".ml-4": { marginLeft: "20px" },
        ".mr-4": { marginRight: "20px" },
        ".p-1": { padding: "5px" },
        ".pt-1": { paddingTop: "5px" },
        ".pb-1": { paddingBottom: "5px" },
        ".pl-1": { paddingLeft: "5px" },
        ".pr-1": { paddingRight: "5px" },
        ".p-2": { padding: "10px" },
        ".pt-2": { paddingTop: "10px" },
        ".pb-2": { paddingBottom: "10px" },
        ".pl-2": { paddingLeft: "10px" },
        ".pr-2": { paddingRight: "10px" },
        ".p-3": { padding: "15px" },
        ".pt-3": { paddingTop: "15px" },
        ".pb-3": { paddingBottom: "15px" },
        ".pl-3": { paddingLeft: "15px" },
        ".pr-3": { paddingRight: "15px" },
        ".p-4": { padding: "20px" },
        ".pt-4": { paddingTop: "20px" },
        ".pb-4": { paddingBottom: "20px" },
        ".pl-4": { paddingLeft: "20px" },
        ".pr-4": { paddingRight: "20px" },

    },
});

export const GlobalCSSBootstrap = GlobalCSSBootstrapStyles(() => null);
