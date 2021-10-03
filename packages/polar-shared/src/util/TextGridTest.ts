import {TextGrid} from "./TextGrid";

describe("TextGrid", function() {
    it("basic", () => {

        const grid = TextGrid.create(2);

        grid.headers("col_a", "col_b");
        grid.row('1', '2');
        grid.row('three', 'four');
        grid.row('five', 'one hundred bazillion million trillion');

        console.log(grid.format());

    });
})
