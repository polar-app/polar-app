import {UserInterviewer} from "../../impl/user_interviews/UserInterviewer";
import {FromOpts} from "../../impl/user_interviews/UserInterviewMessages";

async function exec() {

    const from: FromOpts = {
        firstName: "Jonathan",
        email: "jonathan@getpolarized.io",
        calendarLink: 'https://calendly.com/jonathangraeupner/30min'
    };

    await UserInterviewer.exec(from);
}

exec()
    .catch(err => console.error(err));
