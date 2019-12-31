import * as React from 'react';
import {Button, Modal, ModalBody, ModalFooter} from 'reactstrap';
import {CloudSyncConfiguredContent} from './CloudSyncConfiguredContent';
import {Link} from "react-router-dom";

export const CloudSyncConfiguredModal = () => (
    <Modal isOpen={true} size="lg">
        <ModalBody>
            <CloudSyncConfiguredContent/>
        </ModalBody>
        <ModalFooter>

            <Link to="/" replace={true}>
                <Button color="primary"
                        size="lg">
                    OK
                </Button>
            </Link>

        </ModalFooter>
    </Modal>

);
