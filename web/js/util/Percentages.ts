export class Percentages {

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
