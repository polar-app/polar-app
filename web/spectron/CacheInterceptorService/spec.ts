import {SpectronSpec} from '../../js/test/SpectronSpec';
import {Spectron} from '../../js/test/Spectron';
import {MockPHZWriter} from '../../js/phz/MockPHZWriter';


describe("CacheInterceptorService", function () {

    this.timeout(10000);

    Spectron.setup(__dirname);

    let path = "/tmp/cache-interceptor-service.phz";

    before(async function () {

        await MockPHZWriter.write(path)

    });

    it('Load PHZ file via cache', async function () {

        await SpectronSpec.create(this.app).waitFor(true);

    });

});
