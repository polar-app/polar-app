"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIRelatedOptions = void 0;
var Box_1 = require("@material-ui/core/Box");
var React = require("react");
var MUIRelatedOptionsChips_1 = require("./MUIRelatedOptionsChips");
function MUIRelatedOptions(props) {
    if (props.relatedOptions.length === 0) {
        return null;
    }
    return <Box_1.default mt={1}>

        <Box_1.default mb={1} color="text.secondary">
            <strong>Related tags: </strong>
        </Box_1.default>

        <MUIRelatedOptionsChips_1.MUIRelatedOptionsChips {...props}/>

    </Box_1.default>;
}
exports.MUIRelatedOptions = MUIRelatedOptions;
;
