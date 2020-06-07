import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {UncontrolledPopover} from 'reactstrap';
import {AccountProvider} from "../../../../web/js/accounts/AccountProvider";
import {DropdownChevron} from "../../../../web/js/ui/util/DropdownChevron";
import {Callback} from "polar-shared/src/util/Functions";
import {Link} from 'react-router-dom';
import {GiftSVGIcon} from "../../../../web/js/ui/svg_icons/GiftSVGIcon";
import {SVGIcon} from "../../../../web/js/ui/svg_icons/SVGIcon";

interface ButtonProps {
    readonly onClick: Callback;
}

export const HolidayPromotionCopy = (props: ButtonProps) => {

    return (
        <div className="text-center text-md">

            <div className="mt-3 mb-3">
                <SVGIcon size={200}>
                    <GiftSVGIcon/>
                </SVGIcon>
            </div>

            <h2>Get Polar Bronze for 66% Off</h2>

            <h4>Save $39 on a 1 year subscription</h4>

            <p>
                Offer includes mobile flashcard review, related tags, and increased storage!
            </p>

            <p className="text-muted">$19.95 for 12 months vs $59.88. Offer Valid until Dec 31, 2019.</p>

            <p>

                <Link to={{pathname: '/plans-year'}}>
                    <Button color="success"
                            size="lg"
                            onClick={() => props.onClick()}>
                        Claim my Discount
                    </Button>
                </Link>

            </p>

        </div>
    );

};

export class HolidayPromotionButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onUpgrade = this.onUpgrade.bind(this);
    }

    public render() {

        const account = AccountProvider.get();

        if (account && account.plan === 'gold') {
            // already at max account level
            return null;
        }

        return (
            <div>

                <Button color="clear"
                        id="holiday-promotion-button"
                        size="md"
                        style={{
                            whiteSpace: 'nowrap',
                            backgroundColor: '#E45E5B',
                            color: 'var(--white)',
                            fontWeight: 'bold'
                        }}
                        className="pl-2 pr-2 border">

                    <i className="fas fa-gift"/> Holiday Promotion!

                    <DropdownChevron/>

                </Button>

                <UncontrolledPopover trigger="legacy"
                                     placement="bottom"
                                     target="holiday-promotion-button"
                                     delay={0}
                                     fade={false}
                                     style={{maxWidth: '600px'}}>

                    <PopoverBody className="shadow text-md">

                        <HolidayPromotionCopy onClick={() => this.onUpgrade()}/>

                    </PopoverBody>

                </UncontrolledPopover>

            </div>
        );

    }

    private onUpgrade() {
        // Analytics.event({category: 'premium-promotion', action: 'xmas-2019'});
    }

}

interface IProps {
}

interface IState {

}
