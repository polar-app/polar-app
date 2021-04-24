export class ArchiveLinks {

    public static source(url: string) {
        return url.replace(/http:\/\/web\.archive\.org\/web\/[0-9]+\//, '');
    }

}

