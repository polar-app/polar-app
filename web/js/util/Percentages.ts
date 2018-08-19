export class Percentages {

    static calculate(value: number, total: number) {
        return Percentages.round( 100 * (value / total));
    }

    /**
     *
     */
    static round(perc: number) {
        return Math.round(perc * 100) / 100;
    }

}

export function round(perc: number) {
    return Percentages.round(perc);
}
