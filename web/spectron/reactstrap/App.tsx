import * as React from 'react';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupButtonDropdown,
    ListGroup,
    ListGroupItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import Navbar from 'reactstrap/lib/Navbar';
import {BrowserConfigurationInputGroup} from './BrowserConfigurationInputGroup';
import Moment from 'react-moment';
import {ListSelector, ListOptionType} from '../../js/ui/list_selector/ListSelector';
import {TableDropdown} from "../../../apps/repository/js/TableDropdown";
import {SyncBar} from '../../js/ui/sync_bar/SyncBar';
import {IStyleMap} from '../../js/react/IStyleMap';
const CreditCardInput = require('react-credit-card-input');


const Styles: IStyleMap = {

    button: {
        paddingTop: '4px',
        color: 'red !important',
        fontSize: '15px'

        // minWidth: '350px',
        // width: '350px'
    },

    icon: {
        fontSize: '120px',
        margin: '20px',
        color: '007bff'
        // minWidth: '350px',
        // width: '350px'
    },

    overview: {
        fontSize: '18px',
        textAlign: 'justify',
        margin: '25px'
    },

    features: {
        marginLeft: '25px'
    },

    price: {
        textAlign: 'center',
    },

    price_value: {
        fontSize: '40px',
        fontWeight: 'bold',
        lineHeight: '1em',
    },

    price_overview: {
        fontSize: '14px',
    }

};

class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

        // this.toggleDropDown = this.toggleDropDown.bind(this);
        // this.toggleSplit = this.toggleSplit.bind(this);
        this.state = {
            dropdownOpen: false,
            splitButtonOpen: false
        };
    }

    public render() {
        //
        // const options: ListOptionType[] = [
        //     {
        //         id: "title",
        //         label: "Title",
        //         selected: true
        //     },
        //     {
        //         id: "tags",
        //         label: "Tags",
        //         selected: false
        //     }
        // ];

        console.log("asdf");

        return (

            <div>

                    <Modal isOpen={true}>
                        {/*<ModalHeader>Polar Cloud Sync</ModalHeader>*/}
                        <ModalBody>

                            <div className="text-center">

                                <i className="fas fa-cloud-upload-alt" style={Styles.icon}></i>

                                <h1>Polar Cloud Sync</h1>

                            </div>

                            <p className="intro" style={Styles.overview}>
                                Polar Cloud Sync enables synchronization of your
                                documents and annotations between mulitple
                                devices transparently with the cloud.
                            </p>

                            <ul style={Styles.features}>

                                <li>Full sync of your data into the cloud in
                                realtime.  Your files are immediately
                                distributed to your other devices.</li>

                                <li>10 GB of storage for all you documents and
                                annotations.</li>

                                <li>Private access control. Your data is private
                                and only accessible to your account.</li>

                                <li>Full offline access with cloud sync upon
                                    reconnect.</li>

                            </ul>

                            <p style={Styles.price}>

                                <div style={Styles.price_value}>
                                    $7.99
                                </div>

                                <div className="text-muted" style={Styles.price_overview}>
                                    per month
                                </div>

                            </p>

                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary">Sign Up</Button>{' '}
                            <Button color="secondary">Cancel</Button>
                        </ModalFooter>
                    </Modal>

                <CreditCardInput
                    // cardNumberInputProps={{ value: cardNumber, onChange: this.handleCardNumberChange }}
                    // cardExpiryInputProps={{ value: expiry, onChange: this.handleCardExpiryChange }}
                    // cardCVCInputProps={{ value: cvc, onChange: this.handleCardCVCChange }}
                    fieldClassName="input"
                />

                    {/*<div className="col-md-8 order-md-1">*/}
                        {/*<h4 className="mb-3">Billing address</h4>*/}
                        {/*<form className="needs-validation" noValidate=""*/}
                              {/*_lpchecked="1">*/}
                            {/*<div className="row">*/}
                                {/*<div className="col-md-6 mb-3">*/}
                                    {/*<label htmlFor="firstName">First*/}
                                        {/*name</label>*/}
                                    {/*<input type="text" className="form-control"*/}
                                           {/*id="firstName" placeholder=""*/}
                                           {/*value="" required*/}
                                           {/*style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVQ4EaVTO26DQBD1ohQWaS2lg9JybZ+AK7hNwx2oIoVf4UPQ0Lj1FdKktevIpel8AKNUkDcWMxpgSaIEaTVv3sx7uztiTdu2s/98DywOw3Dued4Who/M2aIx5lZV1aEsy0+qiwHELyi+Ytl0PQ69SxAxkWIA4RMRTdNsKE59juMcuZd6xIAFeZ6fGCdJ8kY4y7KAuTRNGd7jyEBXsdOPE3a0QGPsniOnnYMO67LgSQN9T41F2QGrQRRFCwyzoIF2qyBuKKbcOgPXdVeY9rMWgNsjf9ccYesJhk3f5dYT1HX9gR0LLQR30TnjkUEcx2uIuS4RnI+aj6sJR0AM8AaumPaM/rRehyWhXqbFAA9kh3/8/NvHxAYGAsZ/il8IalkCLBfNVAAAAABJRU5ErkJggg==&quot;); background-repeat: no-repeat; background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%; cursor: auto;">*/}
                                        {/*<div className="invalid-feedback">*/}
                                            {/*Valid first name is required.*/}
                                        {/*</div>*/}
                                    {/*</input>*/}
                                {/*</div>*/}
                                {/*<div className="col-md-6 mb-3">*/}
                                    {/*<label htmlFor="lastName">Last name</label>*/}
                                    {/*<input type="text" className="form-control"*/}
                                           {/*id="lastName" placeholder="" value=""*/}
                                           {/*required>*/}
                                        {/*<div className="invalid-feedback">*/}
                                            {/*Valid last name is required.*/}
                                        {/*</div>*/}
                                    {/*</input>*/}
                                {/*</div>*/}
                            {/*</div>*/}

                            {/*<div className="mb-3">*/}
                                {/*<label htmlFor="username">Username</label>*/}
                                {/*<div className="input-group">*/}
                                    {/*<div className="input-group-prepend">*/}
                                        {/*<span*/}
                                            {/*className="input-group-text">@</span>*/}
                                    {/*</div>*/}
                                    {/*<input type="text" className="form-control"*/}
                                           {/*id="username" placeholder="Username"*/}
                                           {/*required>*/}
                                        {/*<div className="invalid-feedback"*/}
                                             {/*style="width: 100%;">*/}
                                            {/*Your username is required.*/}
                                        {/*</div>*/}
                                    {/*</input>*/}
                                {/*</div>*/}
                            {/*</div>*/}

                            {/*<div className="mb-3">*/}
                                {/*<label htmlFor="email">Email <span*/}
                                    {/*className="text-muted">(Optional)</span></label>*/}
                                {/*<input type="email" className="form-control"*/}
                                       {/*id="email" placeholder="you@example.com">*/}
                                    {/*<div className="invalid-feedback">*/}
                                        {/*Please enter a valid email address for*/}
                                        {/*shipping updates.*/}

                                    {/*</div>*/}
                                {/*</input>*/}
                            {/*</div>*/}

                            {/*<div className="mb-3">*/}
                                {/*<label htmlFor="address">Address</label>*/}
                                {/*<input type="text" className="form-control"*/}
                                       {/*id="address" placeholder="1234 Main St"*/}
                                       {/*required>*/}
                                    {/*<div className="invalid-feedback">*/}
                                        {/*Please enter your shipping address.*/}
                                    {/*</div>*/}
                                {/*</input>*/}
                            {/*</div>*/}

                            {/*<div className="mb-3">*/}
                                {/*<label htmlFor="address2">Address 2 <span*/}
                                    {/*className="text-muted">(Optional)</span></label>*/}
                                {/*<input type="text" className="form-control"*/}
                                       {/*id="address2"*/}
                                       {/*placeholder="Apartment or suite">*/}
                            {/*</div>*/}

                            {/*<div className="row">*/}
                                {/*<div className="col-md-5 mb-3">*/}
                                    {/*<label htmlFor="country">Country</label>*/}
                                    {/*<select*/}
                                        {/*className="custom-select d-block w-100"*/}
                                        {/*id="country" required="">*/}
                                        {/*<option value="">Choose...</option>*/}
                                        {/*<option>United States</option>*/}
                                    {/*</select>*/}
                                    {/*<div className="invalid-feedback">*/}
                                        {/*Please select a valid country.*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                                {/*<div className="col-md-4 mb-3">*/}
                                    {/*<label htmlFor="state">State</label>*/}
                                    {/*<select*/}
                                        {/*className="custom-select d-block w-100"*/}
                                        {/*id="state" required="">*/}
                                        {/*<option value="">Choose...</option>*/}
                                        {/*<option>California</option>*/}
                                    {/*</select>*/}
                                    {/*<div className="invalid-feedback">*/}
                                        {/*Please provide a valid state.*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                                {/*<div className="col-md-3 mb-3">*/}
                                    {/*<label htmlFor="zip">Zip</label>*/}
                                    {/*<input type="text" className="form-control"*/}
                                           {/*id="zip" placeholder="" required="">*/}
                                        {/*<div className="invalid-feedback">*/}
                                            {/*Zip code required.*/}
                                        {/*</div>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            {/*<hr className="mb-4">*/}
                                {/*<div className="custom-control custom-checkbox">*/}
                                    {/*<input type="checkbox"*/}
                                           {/*className="custom-control-input"*/}
                                           {/*id="same-address">*/}
                                        {/*<label className="custom-control-label"*/}
                                               {/*htmlFor="same-address">Shipping*/}
                                            {/*address is the same as my billing*/}
                                            {/*address</label>*/}
                                {/*</div>*/}
                                {/*<div className="custom-control custom-checkbox">*/}
                                    {/*<input type="checkbox"*/}
                                           {/*className="custom-control-input"*/}
                                           {/*id="save-info">*/}
                                        {/*<label className="custom-control-label"*/}
                                               {/*htmlFor="save-info">Save this*/}
                                            {/*information for next time</label>*/}
                                {/*</div>*/}
                                {/*<hr className="mb-4">*/}

                                    {/*<h4 className="mb-3">Payment</h4>*/}

                                    {/*<div className="d-block my-3">*/}
                                        {/*<div*/}
                                            {/*className="custom-control custom-radio">*/}
                                            {/*<input id="credit"*/}
                                                   {/*name="paymentMethod"*/}
                                                   {/*type="radio"*/}
                                                   {/*className="custom-control-input"*/}
                                                   {/*checked="" required="">*/}
                                                {/*<label*/}
                                                    {/*className="custom-control-label"*/}
                                                    {/*htmlFor="credit">Credit*/}
                                                    {/*card</label>*/}
                                        {/*</div>*/}
                                        {/*<div*/}
                                            {/*className="custom-control custom-radio">*/}
                                            {/*<input id="debit"*/}
                                                   {/*name="paymentMethod"*/}
                                                   {/*type="radio"*/}
                                                   {/*className="custom-control-input"*/}
                                                   {/*required="">*/}
                                                {/*<label*/}
                                                    {/*className="custom-control-label"*/}
                                                    {/*htmlFor="debit">Debit*/}
                                                    {/*card</label>*/}
                                        {/*</div>*/}
                                        {/*<div*/}
                                            {/*className="custom-control custom-radio">*/}
                                            {/*<input id="paypal"*/}
                                                   {/*name="paymentMethod"*/}
                                                   {/*type="radio"*/}
                                                   {/*className="custom-control-input"*/}
                                                   {/*required="">*/}
                                                {/*<label*/}
                                                    {/*className="custom-control-label"*/}
                                                    {/*htmlFor="paypal">Paypal</label>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                    {/*<div className="row">*/}
                                        {/*<div className="col-md-6 mb-3">*/}
                                            {/*<label htmlFor="cc-name">Name on*/}
                                                {/*card</label>*/}
                                            {/*<input type="text"*/}
                                                   {/*className="form-control"*/}
                                                   {/*id="cc-name" placeholder=""*/}
                                                   {/*required="">*/}
                                                {/*<small*/}
                                                    {/*className="text-muted">Full*/}
                                                    {/*name as displayed on card*/}
                                                {/*</small>*/}
                                                {/*<div*/}
                                                    {/*className="invalid-feedback">*/}
                                                    {/*Name on card is required*/}
                                                {/*</div>*/}
                                        {/*</div>*/}
                                        {/*<div className="col-md-6 mb-3">*/}
                                            {/*<label htmlFor="cc-number">Credit*/}
                                                {/*card number</label>*/}
                                            {/*<input type="text"*/}
                                                   {/*className="form-control"*/}
                                                   {/*id="cc-number" placeholder=""*/}
                                                   {/*required="">*/}
                                                {/*<div*/}
                                                    {/*className="invalid-feedback">*/}
                                                    {/*Credit card number is*/}
                                                    {/*required*/}
                                                {/*</div>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                    {/*<div className="row">*/}
                                        {/*<div className="col-md-3 mb-3">*/}
                                            {/*<label*/}
                                                {/*htmlFor="cc-expiration">Expiration</label>*/}
                                            {/*<input type="text"*/}
                                                   {/*className="form-control"*/}
                                                   {/*id="cc-expiration"*/}
                                                   {/*placeholder="" required="">*/}
                                                {/*<div*/}
                                                    {/*className="invalid-feedback">*/}
                                                    {/*Expiration date required*/}
                                                {/*</div>*/}
                                        {/*</div>*/}
                                        {/*<div className="col-md-3 mb-3">*/}
                                            {/*<label*/}
                                                {/*htmlFor="cc-expiration">CVV</label>*/}
                                            {/*<input type="text"*/}
                                                   {/*className="form-control"*/}
                                                   {/*id="cc-cvv" placeholder=""*/}
                                                   {/*required="">*/}
                                                {/*<div*/}
                                                    {/*className="invalid-feedback">*/}
                                                    {/*Security code required*/}
                                                {/*</div>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                    {/*<hr className="mb-4">*/}
                                        {/*<button*/}
                                            {/*className="btn btn-primary btn-lg btn-block"*/}
                                            {/*type="submit">Continue to checkout*/}
                                        {/*</button>*/}
                        {/*</form>*/}
                    {/*</div>*/}


                    {/*<form className="form-horizontal" role="form">*/}
                        {/*<fieldset>*/}
                            {/*<legend>Payment</legend>*/}
                            {/*<div className="form-group">*/}
                                {/*<label className="col-sm-3 control-label"*/}
                                       {/*htmlFor="card-holder-name">Name on*/}
                                    {/*Card</label>*/}
                                {/*<div className="col-sm-9">*/}
                                    {/*<input type="text" className="form-control"*/}
                                           {/*name="card-holder-name"*/}
                                           {/*id="card-holder-name"*/}
                                           {/*placeholder="Card Holder's Name"></input>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            {/*<div className="form-group">*/}
                                {/*<label className="col-sm-3 control-label"*/}
                                       {/*htmlFor="card-number">Card Number</label>*/}
                                {/*<div className="col-sm-9">*/}
                                    {/*<input type="text" className="form-control"*/}
                                           {/*name="card-number" id="card-number"*/}
                                           {/*placeholder="Debit/Credit Card Number"></input>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            {/*<div className="form-group">*/}
                                {/*<label className="col-sm-3 control-label"*/}
                                       {/*htmlFor="expiry-month">Expiration*/}
                                    {/*Date</label>*/}
                                {/*<div className="col-sm-9">*/}
                                    {/*<div className="row">*/}
                                        {/*<div className="col-xs-3">*/}
                                            {/*<select*/}
                                                {/*className="form-control col-sm-2"*/}
                                                {/*name="expiry-month"*/}
                                                {/*id="expiry-month">*/}
                                                {/*<option>Month</option>*/}
                                                {/*<option value="01">Jan (01)*/}
                                                {/*</option>*/}
                                                {/*<option value="02">Feb (02)*/}
                                                {/*</option>*/}
                                                {/*<option value="03">Mar (03)*/}
                                                {/*</option>*/}
                                                {/*<option value="04">Apr (04)*/}
                                                {/*</option>*/}
                                                {/*<option value="05">May (05)*/}
                                                {/*</option>*/}
                                                {/*<option value="06">June (06)*/}
                                                {/*</option>*/}
                                                {/*<option value="07">July (07)*/}
                                                {/*</option>*/}
                                                {/*<option value="08">Aug (08)*/}
                                                {/*</option>*/}
                                                {/*<option value="09">Sep (09)*/}
                                                {/*</option>*/}
                                                {/*<option value="10">Oct (10)*/}
                                                {/*</option>*/}
                                                {/*<option value="11">Nov (11)*/}
                                                {/*</option>*/}
                                                {/*<option value="12">Dec (12)*/}
                                                {/*</option>*/}
                                            {/*</select>*/}
                                        {/*</div>*/}
                                        {/*<div className="col-xs-3">*/}
                                            {/*<select className="form-control"*/}
                                                    {/*name="expiry-year">*/}
                                                {/*<option value="13">2013</option>*/}
                                                {/*<option value="14">2014</option>*/}
                                                {/*<option value="15">2015</option>*/}
                                                {/*<option value="16">2016</option>*/}
                                                {/*<option value="17">2017</option>*/}
                                                {/*<option value="18">2018</option>*/}
                                                {/*<option value="19">2019</option>*/}
                                                {/*<option value="20">2020</option>*/}
                                                {/*<option value="21">2021</option>*/}
                                                {/*<option value="22">2022</option>*/}
                                                {/*<option value="23">2023</option>*/}
                                            {/*</select>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            {/*<div className="form-group">*/}
                                {/*<label className="col-sm-3 control-label"*/}
                                       {/*htmlFor="cvv">Card CVV</label>*/}
                                {/*<div className="col-sm-3">*/}
                                    {/*<input type="text" className="form-control"*/}
                                           {/*name="cvv" id="cvv"*/}
                                           {/*placeholder="Security Code"></input>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                            {/*<div className="form-group">*/}
                                {/*<div className="col-sm-offset-3 col-sm-9">*/}
                                    {/*<button type="button"*/}
                                            {/*className="btn btn-success">Pay Now*/}
                                    {/*</button>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</fieldset>*/}
                    {/*</form>*/}

                {/*</div>*/}


                {/*<SyncBar/>*/}

                {/*<div className="fa-4x">*/}
                    {/*<span className="fa-layers fa-fw" style={{background: 'MistyRose'}}>*/}
                        {/*<i className="fas fa-circle" style={{color: 'Tomato'}}></i>*/}
                        {/*<i className="fa-inverse fas fa-times" data-fa-transform="shrink-6"></i>*/}
                    {/*</span>*/}

                    {/*/!*https://fontawesome.com/how-to-use/on-the-web/styling/power-transforms*!/*/}

                    {/*<span className="fa-layers fa-fw">*/}
                        {/*<i className="fa fa-comment-alt" style={{color: 'grey'}} data-fa-transform="shrink-2 down-1"></i>*/}
                        {/*<i className="fa-inverse fas fa-plus" style={{color: 'white'}}  data-fa-transform="shrink-8 up-0"></i>*/}
                    {/*</span>*/}

                    {/*<span className="fa-layers fa-fw">*/}
                        {/*<i className="fas fa-bolt" style={{color: 'grey'}} data-fa-transform="shrink-2 down-1"></i>*/}
                        {/*<i className="fa-inverse fas fa-plus" style={{color: 'white'}}  data-fa-transform="shrink-8 up-0"></i>*/}
                    {/*</span>*/}

                    {/*<i className="fas fa-spider" data-fa-transform="shrink-8 up-6"></i>*/}



                {/*</div>*/}


                {/*<br/>*/}
                {/*<span className="fa-stack fa-lg" aria-hidden="true">*/}
                  {/*<i className="fa fa-comment fa-stack-2x"></i>*/}
                  {/*<i className="fa fa-plus fa-stack-1x fa-inverse"></i>*/}
                {/*</span>*/}
                {/*<br/>*/}

                {/*<span className="fa-stack fa-lg" aria-hidden="true">*/}
                  {/*<i className="fa fa-comment-alt fa-stack-2x"></i>*/}
                  {/*<i className="fa fa-plus fa-stack-1x fa-inverse"></i>*/}
                {/*</span>*/}
                {/*<br/>*/}


                {/*<i className="fa fa-comment fa-stack-2x"></i>*/}
                {/*<br/>*/}

                {/*<i className="fa fa-comment fa-2x"></i>*/}
                {/*<br/>*/}

                {/*<i className="fa fa-comment fa-lg"></i>*/}
                {/*<br/>*/}
                {/*<i className="fas fa-comment-plus"></i>*/}

                {/*<TableDropdown id={'table-dropdown'}></TableDropdown>*/}

                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}


                {/*<Dropdown isOpen={true} >*/}
                    {/*<DropdownToggle*/}
                        {/*tag="span"*/}
                        {/*data-toggle="dropdown"*/}
                        {/*aria-expanded={true}>*/}
                        {/*Custom Dropdown Content*/}
                    {/*</DropdownToggle>*/}
                    {/*<DropdownMenu>*/}
                        {/*<div >Custom dropdown item</div>*/}
                    {/*</DropdownMenu>*/}
                {/*</Dropdown>*/}

                {/*<ListSelector options={options}*/}
                              {/*id="list-options"*/}
                              {/*onChange={(value) => console.log(value)}>*/}

                {/*</ListSelector>*/}

                    {/*/!*<NavbarBrand href="/">reactstrap</NavbarBrand>*!/*/}
                    {/*/!*<NavbarToggler onClick={this.toggle} />*!/*/}
                    {/*/!*<Collapse isOpen={this.state.isOpen} navbar>*!/*/}
                        {/*/!*<Nav className="ml-auto" navbar>*!/*/}
                            {/*/!*<NavItem>*!/*/}
                                {/*/!*<NavLink href="/components/">Components</NavLink>*!/*/}
                            {/*/!*</NavItem>*!/*/}
                            {/*/!*<NavItem>*!/*/}
                                {/*/!*<NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>*!/*/}
                            {/*/!*</NavItem>*!/*/}
                            {/*/!*<UncontrolledDropdown nav inNavbar>*!/*/}
                                {/*/!*<DropdownToggle nav caret>*!/*/}
                                    {/*/!*Options*!/*/}
                                {/*/!*</DropdownToggle>*!/*/}
                                {/*/!*<DropdownMenu right>*!/*/}
                                    {/*/!*<DropdownItem>*!/*/}
                                        {/*/!*Option 1*!/*/}
                                    {/*/!*</DropdownItem>*!/*/}
                                    {/*/!*<DropdownItem>*!/*/}
                                        {/*/!*Option 2*!/*/}
                                    {/*/!*</DropdownItem>*!/*/}
                                    {/*/!*<DropdownItem divider />*!/*/}
                                    {/*/!*<DropdownItem>*!/*/}
                                        {/*/!*Reset*!/*/}
                                    {/*/!*</DropdownItem>*!/*/}
                                {/*/!*</DropdownMenu>*!/*/}
                            {/*/!*</UncontrolledDropdown>*!/*/}
                        {/*/!*</Nav>*!/*/}
                    {/*/!*</Collapse>*!/*/}

                {/*<Navbar light expand="md" className="p-2 border-bottom link-navbar">*/}

                    {/*<InputGroup size="sm" className="">*/}

                        {/*<InputGroupAddon addonType="prepend"*/}
                                         {/*title="Refresh the current page">*/}
                            {/*/!*<i className="fa fa-close"></i>*!/*/}

                            {/*<Button type="button"*/}
                                    {/*className="btn btn-outline-secondary"*/}
                                    {/*aria-label="">*/}

                                {/*<span className="fa fa-refresh fa-lg" aria-hidden="true"></span>*/}

                            {/*</Button>*/}

                        {/*</InputGroupAddon>*/}
                        {/*<Input className="px-2 mx-1" />*/}
                        {/*<InputGroupAddon addonType="append">*/}
                            {/*/!*<i className="fa fa-close"></i>*!/*/}

                            {/*<Button type="button"*/}
                                    {/*className="btn btn-outline-secondary"*/}
                                    {/*title="Capture the HTML page and save locally"*/}
                                    {/*aria-label=""*/}
                                    {/*disabled>*/}

                                {/*<span className="fa fa-cloud-download fa-lg" aria-hidden="true"></span>*/}

                            {/*</Button>*/}

                        {/*</InputGroupAddon>*/}

                        {/*<BrowserConfigurationInputGroup/>*/}

                    {/*</InputGroup>*/}
                {/*</Navbar>*/}

                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}

                {/*<div className="components">*/}
                    {/*asdf : <Input type="checkbox" />*/}
                    {/*<InputGroup>*/}
                        {/*<InputGroupAddon addonType="prepend"><Button>I'm a button</Button></InputGroupAddon>*/}
                        {/*<Input />*/}
                    {/*</InputGroup>*/}
                    {/*<br />*/}
                    {/*<InputGroup>*/}
                        {/*<Input />*/}
                        {/*<InputGroupButtonDropdown addonType="append"*/}
                                                  {/*isOpen={this.state.dropdownOpen}*/}
                                                  {/*toggle={this.toggleDropDown}>*/}
                            {/*<DropdownToggle caret>*/}
                                {/*Button Dropdown*/}
                            {/*</DropdownToggle>*/}
                            {/*<DropdownMenu>*/}
                                {/*<DropdownItem header>Header</DropdownItem>*/}
                                {/*<DropdownItem disabled>Action</DropdownItem>*/}
                                {/*<DropdownItem>Another Action</DropdownItem>*/}


                                {/*<DropdownItem divider />*/}
                                {/*<DropdownItem><Input type="checkbox" /> asdf</DropdownItem>*/}
                                {/*<DropdownItem>Another Action</DropdownItem>*/}
                            {/*</DropdownMenu>*/}
                        {/*</InputGroupButtonDropdown>*/}
                    {/*</InputGroup>*/}
                    {/*<br />*/}
                    {/*<InputGroup>*/}
                        {/*<InputGroupButtonDropdown addonType="prepend"*/}
                                                  {/*isOpen={this.state.splitButtonOpen}*/}
                                                  {/*toggle={this.toggleSplit}>*/}
                            {/*<Button outline>Split Button</Button>*/}
                            {/*<DropdownToggle split outline />*/}
                            {/*<DropdownMenu>*/}
                                {/*<DropdownItem header>Header</DropdownItem>*/}
                                {/*<DropdownItem disabled>Action</DropdownItem>*/}
                                {/*<DropdownItem>Another Action</DropdownItem>*/}
                                {/*<DropdownItem divider />*/}
                                {/*<DropdownItem>Another Action</DropdownItem>*/}
                            {/*</DropdownMenu>*/}
                        {/*</InputGroupButtonDropdown>*/}
                        {/*<Input placeholder="and..." />*/}
                        {/*<InputGroupAddon addonType="append">*/}
                            {/*<Button color="secondary">I'm a button</Button>*/}
                        {/*</InputGroupAddon>*/}
                    {/*</InputGroup>*/}


                    {/*<br />*/}
                    {/*<br />*/}
                    {/*<br />*/}
                    {/*<br />*/}
                    {/*<br />*/}

                    {/*<div id="hoverbar" style={{width: '250px'}} className="shadow-lg p-1 m-1 bg-white rounded" >*/}

                        {/*<Button size="sm"*/}
                                {/*type="button"*/}
                                {/*className="btn btn-outline-secondary p-2 m-1 rounded-circle"*/}
                                {/*title="Capture HTML page"*/}
                                {/*aria-label=""*/}
                                {/*style={{backgroundColor: 'rgba(255,255,0,0.5)'}} >*/}

                        {/*</Button>*/}

                        {/*<Button size="sm"*/}
                                {/*type="button"*/}
                                {/*className="btn btn-outline-secondary p-2 m-1 rounded-circle"*/}
                                {/*title="Capture HTML page"*/}
                                {/*aria-label=""*/}
                                {/*style={{backgroundColor: 'rgba(255,0,0,0.5)'}} >*/}

                        {/*</Button>*/}

                        {/*<Button size="sm"*/}
                                {/*type="button"*/}
                                {/*className="btn btn-outline-secondary p-2 m-1 rounded-circle"*/}
                                {/*title="Capture HTML page"*/}
                                {/*aria-label=""*/}
                                {/*style={{backgroundColor: 'rgba(0,255,0,0.5)'}} >*/}

                        {/*</Button>*/}


                        {/*<Button size="sm"*/}
                                {/*type="button"*/}
                                {/*className="btn btn-outline-secondary p-2 m-1 rounded-circle"*/}
                                {/*title="Capture HTML page"*/}
                                {/*aria-label=""*/}
                                {/*style={{backgroundColor: 'rgba(0,0,255,0.5)'}} >*/}

                        {/*</Button>*/}

                        {/*<Button size="sm"*/}
                                {/*type="button"*/}
                                {/*className="btn btn-outline-secondary p-1 m-1 "*/}
                                {/*title="Capture HTML page"*/}
                                {/*aria-label=""*/}
                                {/*style={{backgroundColor: 'yellow'}} >*/}

                            {/*<span className="fa fa-tag" aria-hidden="true"></span>*/}

                        {/*</Button>*/}



                        {/*<Button size="sm"*/}
                                {/*type="button"*/}
                                {/*className="btn btn-outline-secondary p-1 m-1"*/}
                                {/*title="Capture HTML page"*/}
                                {/*aria-label=""*/}
                                {/*style={{backgroundColor: 'yellow'}} >*/}

                            {/*<span className="fa fa-tag" aria-hidden="true"></span>*/}

                        {/*</Button>*/}


                        {/*<InputGroup size="sm" style={{width: '100%'}} >*/}

                            {/*<InputGroupAddon addonType="prepend">*/}
                                {/*/!*<i className="fa fa-close"></i>*!/*/}

                                {/*<Button type="button"*/}
                                        {/*className="btn btn-outline-secondary"*/}
                                        {/*title="Capture HTML page"*/}
                                        {/*aria-label=""*/}
                                        {/*style={{backgroundColor: 'yellow'}} >*/}

                                    {/*<span className="fa fa-tag fa-lg" aria-hidden="true"></span>*/}

                                {/*</Button>*/}

                                {/*<Button type="button"*/}
                                        {/*className="btn btn-outline-secondary"*/}
                                        {/*title="Capture HTML page"*/}
                                        {/*aria-label=""*/}
                                        {/*style={{backgroundColor: 'red'}} >*/}

                                    {/*<span className="fa fa-tag fa-lg" aria-hidden="true"></span>*/}

                                {/*</Button>*/}


                                {/*<Button type="button"*/}
                                        {/*className="btn btn-outline-secondary"*/}
                                        {/*title="Capture HTML page"*/}
                                        {/*aria-label="" >*/}

                                    {/*<span className="fa fa-comment-o fa-lg" aria-hidden="true"></span>*/}

                                {/*</Button>*/}

                            {/*</InputGroupAddon>*/}
                            {/*<InputGroupAddon addonType="append">*/}
                                {/*<Button color="secondary">I'm a button</Button>*/}
                            {/*</InputGroupAddon>*/}
                        {/*</InputGroup>*/}
                    {/*</div>*/}


                    {/*<div style={{backgroundColor: 'rgba(0,0,255,0.5)'}}>*/}
                        {/*this is the first*/}
                    {/*</div>*/}


                    {/*<InputGroupButtonDropdown addonType="append"*/}
                                              {/*size="sm"*/}
                                              {/*isOpen={this.state.dropdownOpen}*/}
                                              {/*toggle={this.toggleDropDown}>*/}
                        {/*<DropdownToggle caret>*/}
                            {/*Button Dropdown*/}
                        {/*</DropdownToggle>*/}
                        {/*<DropdownMenu>*/}
                            {/*<DropdownItem header>Header</DropdownItem>*/}
                            {/*<DropdownItem disabled>Action</DropdownItem>*/}
                            {/*<DropdownItem>Another Action</DropdownItem>*/}
                            {/*<DropdownItem divider />*/}
                            {/*<DropdownItem>Another Action</DropdownItem>*/}
                        {/*</DropdownMenu>*/}
                    {/*</InputGroupButtonDropdown>*/}


                {/*</div>*/}
                {/*<Moment fromNow>1976-04-19T12:59-0500</Moment>*/}

                {/*<div>*/}
                    {/*<div className="text-right">asdf</div>*/}
                    {/*<div>asdf</div>*/}
                {/*</div>*/}

                {/*<nav className="navbar navbar-expand-lg navbar-light">*/}
                    {/*<a className="navbar-brand" href="#">Navbar</a>*/}

                    {/*<div className=""*/}
                         {/*id="navbarSupportedContent">*/}
                        {/*<ul className="navbar-nav mr-auto">*/}
                            {/*<li className="nav-item active">*/}
                                {/*<a className="nav-link" href="#">Home <span*/}
                                    {/*className="sr-only">(current)</span></a>*/}
                            {/*</li>*/}
                            {/*<li className="nav-item">*/}
                                {/*<a className="nav-link" href="#">Link</a>*/}
                            {/*</li>*/}
                            {/*<li className="nav-item dropdown">*/}
                                {/*<a className="nav-link dropdown-toggle" href="#"*/}
                                   {/*id="navbarDropdown" role="button"*/}
                                   {/*data-toggle="dropdown" aria-haspopup="true"*/}
                                   {/*aria-expanded="false">*/}
                                    {/*Dropdown*/}
                                {/*</a>*/}
                                {/*<div className="dropdown-menu"*/}
                                     {/*aria-labelledby="navbarDropdown">*/}
                                    {/*<a className="dropdown-item"*/}
                                       {/*href="#">Action</a>*/}
                                    {/*<a className="dropdown-item" href="#">Another*/}
                                        {/*action</a>*/}
                                    {/*<div className="dropdown-divider"></div>*/}
                                    {/*<a className="dropdown-item" href="#">Something*/}
                                        {/*else here</a>*/}
                                {/*</div>*/}
                            {/*</li>*/}
                            {/*<li className="nav-item">*/}
                                {/*<a className="nav-link disabled"*/}
                                   {/*href="#">Disabled</a>*/}
                            {/*</li>*/}
                        {/*</ul>*/}
                        {/*<form className="form-inline my-2 my-lg-0">*/}
                            {/*right*/}
                        {/*</form>*/}
                    {/*</div>*/}
                {/*</nav>*/}

                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}

                {/*<div className="column-selector m-2">*/}

                    {/*<ListGroup>*/}
                        {/*<ListGroupItem>*/}
                            {/*<Input type="checkbox" />*/}
                            {/*Cras justo odio*/}
                        {/*</ListGroupItem>*/}
                        {/*<ListGroupItem>*/}
                            {/*<div className="ml-2">*/}
                                {/*<Input type="checkbox" />*/}
                                {/*Dapibus ac facilisis in*/}
                            {/*</div>*/}
                        {/*</ListGroupItem>*/}
                        {/*<ListGroupItem>Morbi leo risus</ListGroupItem>*/}
                        {/*<ListGroupItem>Porta ac consectetur ac</ListGroupItem>*/}
                        {/*<ListGroupItem>Vestibulum at eros</ListGroupItem>*/}
                    {/*</ListGroup>*/}

                {/*</div>*/}

            </div>
        );
    }


    private toggleDropDown() {

        this.setState({
            splitButtonOpen: this.state.splitButtonOpen,
            dropdownOpen: !this.state.dropdownOpen
        });

    }

    private toggleSplit() {

        this.setState({
            splitButtonOpen: !this.state.splitButtonOpen
        });

    }



}

export default App;

interface IAppState {
    dropdownOpen: boolean;
    splitButtonOpen: boolean;

}


