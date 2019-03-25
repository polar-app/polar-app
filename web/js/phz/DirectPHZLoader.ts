/**
 * Loads PHZs directly by opening them, decompressing them, and parsing the HTML
 * and then replacing the iframes directly.
 */
import {PathStr} from '../util/Strings';
import {URLStr} from '../util/Strings';
import {URLs} from '../util/URLs';
import {PHZReader} from './PHZReader';

export class DirectPHZLoader {

    public static async load(resource: PathStr | URLStr): Promise<void> {

        const toPHZReader = async () => {

            const phzReader = new PHZReader();

            if (URLs.isURL(resource)) {
                const response = await fetch(resource);
                const blob = await response.blob();

                phzReader.init(blob);

            } else {
                // this is a path string.
                phzReader.init(resource);
            }

            return phzReader;

        };

        const phzReader = await toPHZReader();

        const metadata = await phzReader.getMetadata();

        const resources = await phzReader.getResources();

    }

}
