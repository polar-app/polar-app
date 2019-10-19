import {UserInterviewer} from "../../impl/interviews/UserInterviewer";

async function exec() {

    await UserInterviewer.exec()
}

exec()
    .catch(err => console.error(err));
