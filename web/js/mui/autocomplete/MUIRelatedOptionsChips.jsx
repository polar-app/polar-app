"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIRelatedOptionsChips = void 0;
var Grid_1 = require("@material-ui/core/Grid");
var Chip_1 = require("@material-ui/core/Chip");
var React = require("react");
function MUIRelatedOptionsChips(props) {
    return (<Grid_1.default container direction="row" justify="flex-start" alignItems="center" spacing={1}>
            {props.relatedOptions.map(function (option) {
        return <Grid_1.default item key={option.id}>
                    <Chip_1.default label={option.label} size="small" onClick={function () { return props.onAddRelatedOption(option); }}/>
                </Grid_1.default>;
    })}
        </Grid_1.default>);
}
exports.MUIRelatedOptionsChips = MUIRelatedOptionsChips;
;
