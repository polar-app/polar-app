import * as React from "react";
import {Devices} from "../../../util/Devices";
import {Button} from "reactstrap";

interface ReactTablePaginationProps {

    readonly style: React.CSSProperties;
    readonly TheadComponent?: React.ElementType;
    readonly PaginationComponent?: React.ElementType;

}

export class ReactTablePaginationPropsFactory {

    public static create(onNextPage: () => void) {

        if (Devices.isDesktop()) {
            return this.createDesktop();
        } else {
            return this.createPhoneAndTablet(() => onNextPage());
        }

    }

    private static createDesktop(): ReactTablePaginationProps {

        return {
            style: {
                height: '100%',
            },
        };

    }

    private static createPhoneAndTablet(onNextPage: () => void): ReactTablePaginationProps {

        const PaginationComponent = () => (
            <div style={{display: 'flex'}}>

                <Button size="lg"
                        className="btn-no-outline p-1 text-primary"
                        color="clear"
                        style={{
                            fontSize: '1.5em',
                            flexGrow: 1
                        }}
                        onClick={() => onNextPage()}>
                    <i className="fas fa-angle-down"/>
                </Button>

            </div>
        );

        return {
            style: {},
            // the table headers must be disabled.
            TheadComponent: () => null,
            // use our own custom paginator
            PaginationComponent
        };

    }
}
