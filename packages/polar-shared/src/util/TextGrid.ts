import {Numbers} from "./Numbers";
import {arrayStream} from "./ArrayStreams";
import {Reducers} from "./Reducers";
import { Strings } from "./Strings";

export namespace TextGrid {

    export type TextData = string | number | boolean;

    export interface ITextGrid {
        headers: (...cols: ReadonlyArray<string>) => void;
        row: (...cols: ReadonlyArray<TextData>) => void;
        format: () => string;
    }

    export function create(nrColumns: number) {

        let _row: ReadonlyArray<TextData>[] = [];

        let _headers: string[] = [];

        let padd = 1;

        /**
         * Provide optional headers.
         */
        function headers(...cols: ReadonlyArray<string>) {
            _headers = [...cols];
        }

        function row(...cols: ReadonlyArray<TextData>) {

            if (cols.length !== nrColumns) {
                throw new Error("Wrong number of columns")
            }

            _row.push(cols);

        }

        /**
         * Format this to a string
         */
        function format(): string {

            // compute the column widths

            if (_row.length === 0) {
                return ""
            }

            function columnWidth(col: number) {
                return arrayStream(_row)
                    .map(current => current[col].toString().length)
                    .collect()
                    .reduce(Reducers.MAX);
            }

            // compute the widths of the columns
            const widths
                = Numbers.range(0, nrColumns - 1)
                    .map(columnWidth)

            function formatToColumnWidth(data: ReadonlyArray<TextData>) {
                const sep = Strings.generate(padd, ' ')
                return data.map((current, idx) => Strings.rpad(current.toString(), ' ', widths[idx])).join(sep)
            }

            let buff = '';

            if (_headers.length > 0) {

                buff += formatToColumnWidth(_headers);
                buff += '\n'

                buff += formatToColumnWidth(widths.map(current => Strings.generate(current, '-')))
                buff += '\n'

            }

            buff += _row.map(row => formatToColumnWidth(row)).join("\n")

            return buff;

        }

        return {headers, row, format}

    }

}
