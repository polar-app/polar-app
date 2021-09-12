export class Stderr {

    public static die(desc: string) {
        console.error("ERROR: " + desc);
        process.exit(1);
    }

}

