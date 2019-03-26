import {DirectPHZLoader} from '../web/js/phz/DirectPHZLoader';

console.log("FIXME1");

async function doLoad() {


    const path = "/home/burton/.polar/stash/12EEqbAeuX-YC_s_Essential_Startup_Advice.phz";
    const loader = await DirectPHZLoader.create(path);
    await loader.load();

}


doLoad()
    .catch(err => console.log("Could not handle phz: ", err));
