/**
 * Simple way to build large strings using a buffer and then join at the end.
 *
 * Not sure this is 100% needed in 2018 Javascript though.
 */
export class StringBuffer {

    private readonly backing: readonly string[] = [];

    public append(...data: readonly string[]): this {
        this.backing.push(...data);
        return this;
    }

    public toString(): string {
        return this.backing.join('');
    }

}