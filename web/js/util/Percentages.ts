export class Percentages {

    public static calculate(value: number,
                            total: number,
                            opts: CalculateOpts = {}): number {

        const raw = 100 * (value / total);

        if (opts.noRound) {
            return raw;
        }

        return Percentages.round(raw);
    }

    public static round(perc: number): number {
        return Math.round(perc * 100) / 100;
    }

}

export function round(perc: number) {
    return Percentages.round(perc);
}

interface CalculateOpts {
    readonly noRound?: boolean;
}
