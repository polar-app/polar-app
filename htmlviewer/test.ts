import {DirectPHZLoader} from '../web/js/phz/DirectPHZLoader';

console.log("FIXME1");

DirectPHZLoader.load("/home/burton/.polar/stash/12EEqbAeuX-YC_s_Essential_Startup_Advice.phz")
    .catch(err => console.log("Could not handle phz: ", err));
