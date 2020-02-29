import * as React from 'react';
import {IconStyles} from './IconStyles';

/**
 */
export class DropdownIcon extends React.PureComponent<IProps> {

    public render() {

        return (

            <i style={IconStyles.ICON} className="fas fa-ellipsis-h"/>

        );

    }

}

interface IProps {
}
