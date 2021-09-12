import {Stats} from "../../impl/user_interviews/Stats";

async function exec() {

    await Stats.exec()
}

exec()
    .catch(err => console.error(err));
