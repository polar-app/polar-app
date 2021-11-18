import {Numbers} from "./Numbers";
import {arrayStream} from "./ArrayStreams";
import {Reducers} from "./Reducers";
import {Strings} from "./Strings";

export namespace TextGrid {

    export type TextData = string | number | boolean;

    export interface ITextGrid {
        title: (title: string) => void;
        headers: (...cols: ReadonlyArray<string>) => void;
        row: (...cols: ReadonlyArray<TextData>) => void;
        format: () => string;
    }

    export function createFromHeaders(...headers: ReadonlyArray<string>) {

        const result = create(headers.length);
        result.headers(...headers);
        return result;

    }

    /**
     * @Deprecated
     */
    export function create(nrColumns: number) {

        let _rows: ReadonlyArray<TextData>[] = [];

        let _headers: string[] = [];

        let col_padding = 2;

        let _title: string | undefined;

        function title(title: string) {
            _title = title;
        }

        /**
         * Provide optional headers.
         * @Deprecated
         */
        function headers(...cols: ReadonlyArray<string>) {
            _headers = [...cols];
        }

        function row(...cols: ReadonlyArray<TextData>) {

            if (cols.length !== nrColumns) {
                throw new Error(`Attempted to write row with ${cols.length} columns when we only have ${nrColumns} header columns: ${_headers} vs ${cols}`);
            }

            _rows.push(cols);

        }

        /**
         * Format this to a string
         */
        function format(): string {

            // compute the column widths

            if (_rows.length === 0) {
                return ""
            }

            function columnWidth(col: number) {
                return arrayStream([_headers, ..._rows])
                    .map(current => current[col].toString().length)
                    .collect()
                    .reduce(Reducers.MAX);
            }

            // compute the widths of the columns
            const widths
                = Numbers.range(0, nrColumns - 1)
                    .map(columnWidth)

            function formatToColumnWidth(data: ReadonlyArray<TextData>) {
                const sep = Strings.generate(col_padding, ' ')
                return data.map((current, idx) => Strings.rpad(current.toString(), ' ', widths[idx])).join(sep)
            }

            let buff = '';

            if (_title !== undefined) {
                buff += _title + ":"
                buff += "\n"
                buff += Strings.generate(_title.length, "-") + "-"
                buff += "\n"
            }

            if (_headers.length > 0) {

                buff += formatToColumnWidth(_headers);
                buff += '\n'

                buff += formatToColumnWidth(widths.map(current => Strings.generate(current, '-')))
                buff += '\n'

            }

            buff += _rows.map(row => formatToColumnWidth(row)).join("\n")

            return buff;

        }

        return {headers, row, format, title}

    }

}
