export class Percentages {

    public static calculate(value: number, total: number): number {
        return Percentages.round( 100 * (value / total));
    }

    public static round(perc: number): number {
        return Math.round(perc * 100) / 100;
    }

}

export function round(perc: number) {
    return Percentages.round(perc);
}
