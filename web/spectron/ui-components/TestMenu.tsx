import * as React from 'react';
import Dropdown, {
    DropdownToggle,
    DropdownMenu,
    DropdownMenuWrapper,
    MenuItem,
    DropdownButton
} from '@trendmicro/react-dropdown';
import {NULL_FUNCTION} from '../../js/util/Functions';

export class TestMenu extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);


        this.state = {
        };

    }

    public render() {

        return (

            <div>
                <Dropdown open={true}
                          onToggle={NULL_FUNCTION}
                          onSelect={NULL_FUNCTION}>

                    <DropdownMenu>

                        <MenuItem header>Header</MenuItem>
                        <MenuItem eventKey={1}>link</MenuItem>
                        <MenuItem divider />
                        <MenuItem header>Header</MenuItem>
                        <MenuItem eventKey={2}>link</MenuItem>
                        <MenuItem eventKey={3} disabled>disabled</MenuItem>
                        <MenuItem eventKey={4} title="link with title">
                            link with title
                        </MenuItem>

                        <MenuItem eventKey={5}
                                  active
                                  onSelect={(eventKey: number) => {
                                      alert(`Alert from menu item.\neventKey: ${eventKey}`);
                                  }}>
                            link that alerts
                        </MenuItem>
                    </DropdownMenu>

                </Dropdown>
            </div>

        );
    }

}
