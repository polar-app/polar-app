import {Stats} from "../../impl/interviews/Stats";

async function exec() {

    await Stats.exec()
}

exec()
    .catch(err => console.error(err));
