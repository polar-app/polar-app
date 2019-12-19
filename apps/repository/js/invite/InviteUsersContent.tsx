import * as React from 'react';

class Styles {

    public static icon: React.CSSProperties = {
        fontSize: '120px',
        margin: '20px',
        color: '#007bff'
    };

}

export class InviteUsersContent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (
            <div className="intro p-1">

                <div className="text-center">

                    <i className="fas fa-envelope-open" style={Styles.icon}/>

                    <h1 className="title">Invite Your Friends to Polar</h1>

                </div>

                <p className="subtitle" style={{}}>
                    One month free of cloud storage for every friend
                    you invite!
                </p>
                <p>
                    Just enter their emails below and we'll send them an
                    invitation.
                </p>

                <p>
                    We'll also give you the option to follow them once we enable
                    document sharing in a future release!
                </p>

                <label className="text-muted">Enter email addresses below:</label>

                <div className="mt-2">
                    <textarea autoFocus={true}
                              onChange={(element) => this.props.onInvitedUserText(element.currentTarget.value)}
                              style={{width: '100%', height: '100px'}}>

                    </textarea>
                </div>

            </div>

        );
    }

}

interface IProps {

    onInvitedUserText: (text: string) => void;

}

interface IState {

}


