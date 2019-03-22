/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Logger} from '../../logger/Logger';
import Button from 'reactstrap/lib/Button';
import {Visibility} from '../../datastore/Datastore';

const log = Logger.create();

export class ShareContentControl extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {

        // the current visibility or private by default.
        const visibility = this.props.visibility || Visibility.PRIVATE;

        const VisibilityDescription = () => {

            if (visibility === 'private') {

                return <p>Documents that are <b>private</b> may only be seen or
                    edited by you and are not available to anyone else including
                    search engines.
                </p>;

            } else {
                return <p>Documents that are <b>public</b> are <i>shared publicly
                    on the Internet</i> with anyone who has access to the URL including
                    search engines. Only you can add annotations which appear on
                    this URL. The user may add the document to their own document
                    repository to add their own annotations.</p>;
            }

        };

        const outlines = {
            _private: visibility !== Visibility.PRIVATE,
            _public: visibility !== Visibility.PUBLIC,
        };

        return (

            <div>

                <div style={{
                    display: 'flex',
                    verticalAlign: 'top'
                }}>

                    <div className="p-1">

                        <div style={{display: 'block', whiteSpace: 'nowrap'}}
                             className="mt-2 mb-2">

                            <Button id="sharing-button-private"
                                    color="primary"
                                    outline={outlines._private}
                                    size="sm"
                                    onClick={() => this.props.onChanged(Visibility.PRIVATE)}>

                                <span className="mr-1">
                                    <i className="fas fa-lock"></i>
                                </span>

                                Private

                            </Button>

                            <Button id="sharing-button-public"
                                    color="primary"
                                    outline={outlines._public}
                                    size="sm"
                                    onClick={() => this.props.onChanged(Visibility.PUBLIC)}
                                    className="ml-1">

                                <span className="mr-1">
                                    <i className="fas fa-lock-open"></i>
                                </span>

                                Public

                            </Button>

                        </div>

                        <p>
                            This document is currently <b>{visibility}</b>.
                        </p>

                        <VisibilityDescription/>

                        <div className="text-right">

                            <Button id="sharing-button-ok"
                                    color="secondary"
                                    size="sm"
                                    onClick={() => this.props.onDone()}
                                    className="ml-1">

                                Done

                            </Button>

                        </div>

                    </div>

                </div>

            </div>

        );

    }

}

interface IProps {

    readonly visibility?: Visibility;

    /**
     * Called when the visibility for this content has chagned.
     */
    readonly onChanged: (visibility?: Visibility) => void;

    readonly onDone: () => void;

}

interface IState {
}
