import {UserInterviewer} from "../../impl/interviews/UserInterviewer";
import {FromOpts} from "../../impl/interviews/UserInterviewMessages";

async function exec() {

    const from: FromOpts = {
        firstName: "Jonathan",
        email: "jonathan@getpolarized.io",
        calendarLink: 'https://calendly.com/jonathanpolarized/30min'
    };

    await UserInterviewer.exec(from);
}

exec()
    .catch(err => console.error(err));
