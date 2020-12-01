import * as React from 'react';
import * as style from './style.css';
import Moment from 'moment';
import { Button, Modal, CustomFrequency, CustomDropdown } from 'app/components';
import {
  Container,
  Form,
  Dropdown,
  DropdownProps,
  DropdownItemProps,
  Grid,
  Header,
  Input,
  Label,
  TextArea
} from 'semantic-ui-react';
// import { FormattedMessage, FormattedNumber, } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { RootState } from 'app/stores';
import { omit } from 'lodash';
import { PromotionActions } from 'app/stores/promotion/actions';
import update from 'immutability-helper';
import { hoursOptions, minutesOptions, PromoLocations } from 'app/constants';
import { PromotionPageState, PromotionState } from 'app/stores/promotion/state';
import { numberChecker } from 'app/utils';
import { Ticket } from 'app/models';

/* 
* TODO: 
* change the type `any` 
*/
export namespace PromoPage {
  export interface Props {
    // promoList: Ticket.Promotion[];
    actions: PromotionActions;
    promoState: PromotionState;
  }

  // TODO:
  // - Change with numeric (float) the string ones for appropriate fields
  // - Change to props the other fields
  // - Change the locations to dynamic creation
  export interface State {
    selectedPromo: Ticket.Promotion | null;
    isNewPromo: boolean;
    selectedPromoIndex: string;
    id: string;
    description: string;
    valuePerTicket: string;
    quantityOfTickets: string;
    totalPromotionValue: string;
    allDay: boolean;
    dateFrom: string;
    dateTo: string;
    hoursFrom: string;
    minutesFrom: string;
    hoursTo: string;
    minutesTo: string;
    timeZone: string;
    repeat: string;
    frequency: string;
    every: string;
    day: string;
    notes: string;
    locations: number[];
    frequencyToBeSaved: number[];
    isDelete: boolean;
    defaultHoursFrom: string;
    defaultHoursTo: string;
    defaultMinutes: string;
    allLocations: boolean;
  }
}

const defaultPromoState:
  Pick<PromoPage.State, 'id' | 'description' | 'valuePerTicket' | 'quantityOfTickets' | 'totalPromotionValue' | 'allDay' | 'dateFrom' | 'dateTo' | 'hoursFrom' | 'minutesFrom' | 'hoursTo' | 'minutesTo' | 'timeZone' | 'repeat' | 'frequency' | 'every' | 'day' | 'notes' | 'locations' | 'frequencyToBeSaved' | 'defaultHoursFrom' | 'defaultHoursTo' | 'defaultMinutes' | 'allLocations'> = {
  id: '',
  description: '',
  valuePerTicket: '',
  quantityOfTickets: '',
  totalPromotionValue: '',
  allDay: false,
  dateFrom: '',
  dateTo: '',
  hoursFrom: '',
  minutesFrom: '',
  hoursTo: '',
  minutesTo: '',
  timeZone: '',
  repeat: '',
  frequency: '',
  every: '',
  day: '',
  notes: '',
  locations: [],
  frequencyToBeSaved: [],
  defaultHoursFrom: '06',
  defaultHoursTo: '18',
  defaultMinutes: '00',
  allLocations: false
};

@connect(
  (state: RootState, ownProps): Pick<PromoPage.Props, 'promoState'> => {
    return {
      promoState: state.promotions // TODO: Change name into .list
    };
  },
  (dispatch: Dispatch): Pick<PromoPage.Props, 'actions'> => ({
    actions: bindActionCreators(omit(PromotionActions, 'Type'), dispatch)
  })
)

export class PromoPage extends React.Component<PromoPage.Props, PromoPage.State> {
  public static defaultProps: Partial<PromoPage.Props> = {};

  constructor(props: PromoPage.Props, context?: any) {
    super(props, context);
    // TODO:
    // - Change with numeric (float) the string ones for appropriate fields on "export interface State {}" above
    // - Change the other fields to props
    // - Possible change the time zone and schedule repeat to enums
    // - Change the locations to dynamic creation
    this.state = {
      selectedPromo: null,
      isNewPromo: false,
      selectedPromoIndex: '',
      ...defaultPromoState,
      isDelete: false
    };

    this.savePromo = this.savePromo.bind(this);
    this.addPromo = this.addPromo.bind(this);
    this.editPromo = this.editPromo.bind(this);
    this.deletePromo = this.deletePromo.bind(this);
    this.cancelSavePromo = this.cancelSavePromo.bind(this);
    this.clearPromoDetails = this.clearPromoDetails.bind(this);
    this.toggleAllDay = this.toggleAllDay.bind(this);
    // this.getTimeZonesDropdown =this.getTimeZonesDropdown.bind(this);
    this.getRepeatDropdown = this.getRepeatDropdown.bind(this);
    this.getPromotionPlaceholder = this.getPromotionPlaceholder.bind(this);
    this.getEveryText = this.getEveryText.bind(this);
    this.handleInputChanges = this.handleInputChanges.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.handleTimeZoneDropdownChange = this.handleTimeZoneDropdownChange.bind(this);
    this.handleHoursFromDropdownChange = this.handleHoursFromDropdownChange.bind(this);
    this.handleMinutesFromDropdownChange = this.handleMinutesFromDropdownChange.bind(this);
    this.handleHoursToDropdownChange = this.handleHoursToDropdownChange.bind(this);
    this.handleMinutesToDropdownChange = this.handleMinutesToDropdownChange.bind(this);
    this.handleRepeatDropdownChange = this.handleRepeatDropdownChange.bind(this);
    this.handleFrequencyDropdownChange = this.handleFrequencyDropdownChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.confirmDeletePromo = this.confirmDeletePromo.bind(this);
    this.cancelDeletePromo = this.cancelDeletePromo.bind(this);
    // this.getData =this.getData.bind(this);
    this.setFrequencyToBeSaved = this.setFrequencyToBeSaved.bind(this);
    this.isChecked = this.isChecked.bind(this);
    this.toggleAllLocations = this.toggleAllLocations.bind(this);
    this.checkEachLocation = this.checkEachLocation.bind(this);
    this.uncheckEachLocation = this.uncheckEachLocation.bind(this);
  }

  public setFrequencyToBeSaved(values: number[]) {
    this.setState(update(this.state, {
      frequencyToBeSaved: { $set: values }
    }));
  }

  public clearPromoDetails() {
    this.setState({ ...defaultPromoState });
  }

  public cancelSavePromo() {
    this.clearPromoDetails();
    // this.setState({ action: PromotionPageState.CANCEL });
    this.props.actions.changePage({ pageState: PromotionPageState.CANCEL });
  }

  public handleOnBlur(e: any) {
    const { name, value } = e.target;

    if (name.match('valuePerTicket')) {
      this.setState({ valuePerTicket: this.formatNumberWithDecimal(value) });
    } else if (name.match('quantityOfTickets')) {
      this.setState({ quantityOfTickets: this.formatNumberWithoutDecimal(value) });
    }
  }

  public handleInputChanges(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name.match('description')) {
      this.setState({ description: value });
    } else if (name.match('valuePerTicket')) {
      this.setState({ valuePerTicket: value });
      const total = this.getStringTotalPromotionValue(this.getNumericValuePerTicket(value), this.getNumericValuePerTicket(this.state.quantityOfTickets)).toString();
      this.setState({
        totalPromotionValue: this.formatNumberWithDecimal(total.toString())
      });
    } else if (name.match('quantityOfTickets')) {
      this.setState({ quantityOfTickets: value });
      const total = this.getStringTotalPromotionValue(this.getNumericValuePerTicket(this.state.valuePerTicket), this.getNumericValuePerTicket(value)).toString();
      this.setState({
        totalPromotionValue: this.formatNumberWithDecimal(total.toString())
      });
    } else if (name.match('totalPromotionValue')) {
      this.setState({ totalPromotionValue: value });
    } else if (name.match('allLocations')) {
      this.setState({ allLocations: e.target.checked });
      this.toggleAllLocations(e.target.checked);
    } else if (name.match('allDay')) {
      this.toggleAllDay(e.target.checked);
    } else if (name.match('dateFrom')) {
      this.setState({ dateFrom: value });
    } else if (name.match('dateTo')) {
      this.setState({ dateTo: value });
    } else if (name.match('hoursFrom')) {
      this.setState({ hoursFrom: value });
    } else if (name.match('hoursTo')) {
      this.setState({ hoursTo: value });
    } else if (name.match('minutesFrom')) {
      this.setState({ minutesFrom: value });
    } else if (name.match('minutesTo')) {
      this.setState({ minutesTo: value });
    } else if (name.match('every')) {
      this.setState({ every: value });
    } else {
      // default
    }
  }

  public toggleAllDay(isAllDay: boolean) {
    this.setState({ allDay: isAllDay });

    if (isAllDay) {
      this.setAllDay();
    }
  }

  public setAllDay() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowFormatted = Moment(tomorrow).format('YYYY-MM-DD');

    this.setState({
      dateFrom: tomorrowFormatted,
      dateTo: tomorrowFormatted,
      hoursFrom: '06',
      hoursTo: '18',
      minutesFrom: '00',
      minutesTo: '00'
    });
  }

  public handleTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ notes: event.target.value });
  }

  public handleTimeZoneDropdownChange(event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) {
    // this.setState(update(this.state, {
    //   timeZone: { $set: data.value as string }
    // }));
    this.setState({ timeZone: data.value as string });
  }

  public handleRepeatDropdownChange(event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) {
    // this.setState(update(this.state, {
    //   repeat: { $set: data.value as string }
    // }));
    this.setState({ repeat: data.value as string });
  }

  public handleFrequencyDropdownChange(event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) {
    this.setState({ frequency: data.value as string });
  }

  public handleHoursFromDropdownChange(event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) {
    this.setState({ hoursFrom: data.value as string });
    if ((data.value as string) !== this.state.defaultHoursFrom) {
      this.toggleAllDay(false);
    }
  }

  public handleMinutesFromDropdownChange(event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) {
    this.setState({ minutesFrom: data.value as string });
    if ((data.value as string) !== this.state.defaultMinutes) {
      this.toggleAllDay(false);
    }
  }

  public handleHoursToDropdownChange(event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) {
    this.setState({ hoursTo: data.value as string });
    if ((data.value as string) !== this.state.defaultHoursTo) {
      this.toggleAllDay(false);
    }
  }

  public handleMinutesToDropdownChange(event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) {
    this.setState({ minutesTo: data.value as string });
    if ((data.value as string) !== this.state.defaultMinutes) {
      this.toggleAllDay(false);
    }
  }

  public getNumericValuePerTicket(valuePerTicket: string) {
    const val: number = parseFloat(valuePerTicket.replace(/,/g, ''));

    if (isNaN(val)) {
      return 0.00;
    }

    return val;
  }

  public getNumericQuantityOfTickets(quantityOfTickets: string) {
    const qty: number = parseFloat(quantityOfTickets.replace(/,/g, ''));

    if (isNaN(qty)) {
      return 0.00;
    }

    return qty;
  }

  public getStringTotalPromotionValue(valuePerTicket: number, quantityOfTickets: number) {
    const total: string = (valuePerTicket * quantityOfTickets).toFixed(2);

    return total;
  }

  public getNumericTotalPromotionValue(totalPromotionValue: string) {
    const total: number = parseFloat(totalPromotionValue.replace(/,/g, ''));

    if (isNaN(total)) {
      return 0.00;
    }

    return total;
  }

  public componentDidMount() {
    this.props.actions.getPromotionList();
  }

  public addPromo() {
    this.clearPromoDetails();
    this.setState({ isNewPromo: true });
    this.props.actions.changePage({ pageState: PromotionPageState.ADD });
  }

  public editPromo(selectedIndex: string) {
    this.props.promoState.list.map((element, index) => {
      if (index.toString() === selectedIndex) {
        this.setState({
          selectedPromoIndex: index.toString(),
          isNewPromo: false,
          id: element.id,
          description: element.description,
          valuePerTicket: this.formatNumberWithDecimal(element.valuePerTicket),
          quantityOfTickets: this.formatNumberWithoutDecimal(element.quantityOfTickets),
          totalPromotionValue: this.formatNumberWithDecimal(element.totalPromotionValue),
          allDay: element.allDay,
          dateFrom: element.dateFrom,
          dateTo: element.dateTo,
          hoursFrom: element.hoursFrom,
          minutesFrom: element.minutesFrom,
          hoursTo: element.hoursTo,
          minutesTo: element.minutesTo,
          timeZone: element.timeZone,
          repeat: element.repeat,
          frequency: element.frequency,
          every: element.every,
          day: element.day,
          notes: element.notes,
          locations: element.locations
        });
      }
    });
    this.props.actions.changePage({ pageState: PromotionPageState.EDIT });
  }

  public savePromo() {
    if (this.state.isNewPromo) {
      this.props.actions.addPromotion({
        SiteNumber: '00019',
        CampaignId: '',
        Description: this.state.description,
        PlayerSegmentId: '005',
        CouponValue: this.getNumericValuePerTicket(this.state.valuePerTicket).toString(),
        CouponCount: this.getNumericQuantityOfTickets(this.state.quantityOfTickets).toString(),
        TotalValue: this.getNumericTotalPromotionValue(this.state.totalPromotionValue).toString(),
        AllDay: this.state.allDay,
        StartDate: this.state.dateFrom,
        EndDate: this.state.dateTo,
        HoursFrom: this.state.hoursFrom,
        MinutesFrom: this.state.minutesFrom,
        HoursTo: this.state.hoursTo,
        MinutesTo: this.state.minutesTo,
        Timezone: this.state.timeZone,
        Repeat: this.state.repeat,
        Frequency: this.state.frequency,
        Every: this.state.every,
        Day: this.state.day,
        Notes: this.state.notes,
        Weekly: this.state.frequency === 'weekly' ? this.state.frequencyToBeSaved : [],
        Monthly: this.state.frequency === 'monthly' ? this.state.frequencyToBeSaved : [],
        Yearly: this.state.frequency === 'yearly' ? this.state.frequencyToBeSaved : [],
        Locations: this.state.locations
      });
    } else {
      this.props.actions.editPromotion({
        // id: this.state.id,
        SiteNumber: '00019',
        CampaignId: this.state.id,
        Description: this.state.description,
        PlayerSegmentId: '005',
        CouponValue: this.getNumericValuePerTicket(this.state.valuePerTicket).toString(),
        CouponCount: this.getNumericQuantityOfTickets(this.state.quantityOfTickets).toString(),
        TotalValue: this.getNumericTotalPromotionValue(this.state.totalPromotionValue).toString(),
        AllDay: this.state.allDay,
        StartDate: this.state.dateFrom,
        EndDate: this.state.dateTo,
        HoursFrom: this.state.hoursFrom,
        MinutesFrom: this.state.minutesFrom,
        HoursTo: this.state.hoursTo,
        MinutesTo: this.state.minutesTo,
        Timezone: this.state.timeZone,
        Repeat: this.state.repeat,
        Frequency: this.state.frequency,
        Every: this.state.every,
        Day: this.state.day,
        Notes: this.state.notes,
        Weekly: this.state.frequency === 'weekly' ? this.state.frequencyToBeSaved : [],
        Monthly: this.state.frequency === 'monthly' ? this.state.frequencyToBeSaved : [],
        Yearly: this.state.frequency === 'yearly' ? this.state.frequencyToBeSaved : [],
        Locations: this.state.locations
      });
    }
  }

  public cancelDeletePromo() {
    this.setState({ isDelete: false });
  }

  public getDescription(): JSX.Element {
    return (
      <React.Fragment>
        <Header size='large' textAlign='center' >
          <Header.Content>
            You are about to delete a promotion
          </Header.Content>
        </Header>
      </React.Fragment>
    );
  }

  public renderModal(): JSX.Element | null {
    if (this.state.isDelete) {
      const modalProps: Modal.Props = {
        closeFunction: this.cancelDeletePromo,
        title: 'Delete Promotion',
        description: this.getDescription(),
        modalStyle: style.modal,
        centered: true,
        size: 'mini',
        headerStyle: style['modal-header'],
        actionsStyle: style['modal-actions']
      };

      return (
        <Modal {...modalProps}>
          <Button
            defaultMessage={<FormattedMessage id='localization-cancel'
              defaultMessage='Cancel' description='Cancel translation' />}
            size='large'
            tabIndex={0}
            customStyle={style['cancel-btn-colors']}
            onClick={this.cancelDeletePromo} />
          <Button
            defaultMessage={<FormattedMessage id='localization-confirm'
              defaultMessage='Confirm' description='Confirm translation' />}
            size='large'
            tabIndex={0}
            customStyle={style['confirm-btn-colors']}
            onClick={this.deletePromo} />
        </Modal>
      );
    }

    return null;
  }

  public confirmDeletePromo(selectedIndex: string) {
    this.setState({ isDelete: true, selectedPromoIndex: selectedIndex });
  }

  public deletePromo() {
    // this.state.promoList.splice(parseInt(this.state.selectedPromoIndex), 1);
    // this.props.actions.deletePromotion(this.props.promoState.list[+this.state.selectedPromoIndex]);
    this.props.promoState.list.map((element, index) => {
      if (index.toString() === this.state.selectedPromoIndex) {
        this.setState({ id: element.id }, () => {
          this.props.actions.deletePromotion({
            SiteNumber: '00019',
            CampaignId: this.state.id
          });
        });
      }
    });
    // console.log('id', this.state.id);  
    this.setState({ isDelete: false });
  }

  public getPromoListView(): JSX.Element {
    return (
      <React.Fragment>
        <Container fluid id={style.container}>
          <Grid>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Header as='h1' textAlign='center'>
                  <FormattedMessage
                    id='localization-promo-list'
                    defaultMessage={this.getHeaderText()}
                    description='Promo List'
                  />
                </Header>
              </Grid.Column>
            </Grid.Row>
            {
              // TODO: Sort the promoList before mapping
              // this.state.promoList.map((element, index) =>
              this.props.promoState.list.map((element, index) =>
                <Grid.Row columns={2} key={index}>
                  <Grid.Column className={style['promo-label']}>
                    {element.description}
                  </Grid.Column>
                  <Grid.Column>
                    <span className={style['edit-button']}>
                      {this.getEditButton(index.toString())}
                    </span>
                    <span>
                      {this.getDeleteButton(index.toString())}
                    </span>
                  </Grid.Column>
                </Grid.Row>
              )
            }
          </Grid>
          {this.renderModal()}
          <span className={style.rightContainer}>
            <span>
              {this.getAddPromoButton()}
            </span>
          </span>
        </Container>
      </React.Fragment>
    );
  }

  public getPromotionPlaceholder() {
    if (this.state.isNewPromo) {
      return 'New Promotion';
    }

    return 'Promotion';
  }

  // public getAddEditPromotionHeader() {
  //   if (this.state.isNewPromo) {
  //     return 'New Promotion';
  //   }

  //   return 'Edit Promotion';
  // }

  // public formatNumberWithDecimal(amount: string) {
  //   return amount.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  // }

  // TODO: Move to common location
  public formatNumberWithDecimal(amount: string) {
    amount = amount.replace(/,/g, '');
    const delimiter = ',';
    const amountArray = amount.split('.', 2);
    let amtInt = parseInt(amountArray[0]);
    let amtDec = amountArray[1];

    if (isNaN(amtInt)) {
      return '';
    }

    let sign = '';

    if (amtInt < 0) {
      sign = '-';
    }

    amtInt = Math.abs(amtInt);
    let amtIntStr = amtInt.toString();
    let newAmtArr = [];

    while (amtIntStr.length > 3) {
      let nn = amtIntStr.substr(amtIntStr.length - 3);
      newAmtArr.unshift(nn);
      amtIntStr = amtIntStr.substr(0, amtIntStr.length - 3);
    }

    if (amtIntStr.length > 0) {
      newAmtArr.unshift(amtIntStr);
    }

    const newAmtStr = newAmtArr.join(delimiter);
    let formatted = '';

    if (amtDec === '' || amtDec === undefined || amtDec.length < 1) {
      formatted = newAmtStr + '.00';
    } else {
      formatted = newAmtStr + '.' + amtDec;
    }

    formatted = sign + formatted;

    return formatted;
  }

  // TODO: Move to common location
  public formatNumberWithoutDecimal(amount: string) {
    amount = amount.replace(/,/g, '');
    const delimiter = ',';
    const amountArray = amount.split('.', 2);
    let amountInt = parseInt(amountArray[0]);

    if (isNaN(amountInt)) {
      return '';
    }

    let sign = '';

    if (amountInt < 0) {
      sign = '-';
    }

    amountInt = Math.abs(amountInt);
    let amtIntStr = amountInt.toString();
    let newAmtArr = [];

    while (amtIntStr.length > 3) {
      let nn = amtIntStr.substr(amtIntStr.length - 3);
      newAmtArr.unshift(nn);
      amtIntStr = amtIntStr.substr(0, amtIntStr.length - 3);
    }

    if (amtIntStr.length > 0) {
      newAmtArr.unshift(amtIntStr);
    }

    const formatted = sign + newAmtArr.join(delimiter);

    return formatted;
  }

  public getData(): number[] {
    let data: number[] = [];

    if (this.state.frequency === 'daily') {
      // TO DO: get the daily
      data = [];
    } else if (this.state.frequency === 'weekly') {
      data = this.props.promoState.list[+this.state.selectedPromoIndex].weekly;
    } else if (this.state.frequency === 'monthly') {
      data = this.props.promoState.list[+this.state.selectedPromoIndex].monthly;
    } else if (this.state.frequency === 'yearly') {
      data = this.props.promoState.list[+this.state.selectedPromoIndex].yearly;
    } else {
      data = [];
    }

    return data;
  }

  public toggleAllLocations(isChecked: boolean) {
    if (isChecked) {
      PromoLocations.map((element, index) => this.checkEachLocation(element.id));
    } else {
      PromoLocations.map((element, index) => this.uncheckEachLocation(element.id));
    }
  }

  public checkEachLocation(id: number) {
    if (!this.state.locations.includes(id)) {
      this.state.locations.push(id);
    }
  }

  public uncheckEachLocation(id: number) {
    if (this.state.locations.includes(id)) {
      this.state.locations.splice(this.state.locations.indexOf(id), 1);
    }
  }

  public handleLocationChange(id: number) {
    if (this.state.locations.includes(id)) {
      this.setState(update(this.state, {
        locations: { $splice: [[this.state.locations.indexOf(id), 1]] }
      }));
    } else {
      this.setState(update(this.state, {
        locations: { $push: [id] }
      }));
    }
  }

  public isChecked(id: number): boolean {
    let isChecked: boolean = false;
    if (this.state.locations.includes(id)) {
      isChecked = true;
    }
    return isChecked;
  }

  // TODO: Remove inline styles and transfer to style.css
  public getAddEditPromoView(): JSX.Element {
    return (
      <React.Fragment>
        <Container fluid id={style.container}>
          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column className={style.label}>
                Promotion:
              </Grid.Column>
              <Grid.Column>
                <Input
                  type='text'
                  name='description'
                  size='large'
                  placeholder={this.getPromotionPlaceholder()}
                  fluid
                  value={this.state.description}
                  onChange={this.handleInputChanges} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Column className={style.label}>
                Location(s):
              </Grid.Column>
              <Grid.Column className={style['checkbox-label']}>
                <input type='checkbox' name='allLocations' checked={this.state.allLocations} onChange={this.handleInputChanges} style={{ marginRight: '10px' }} />
                {'All Locations'}
              </Grid.Column>
            </Grid.Row>
            {PromoLocations.map((element, index) => (
              <Grid.Row key={index} columns={3}>
                <Grid.Column className={style.label}>
                  {/* {index ===0 && 'Location(s):'} */}
                </Grid.Column>
                <Grid.Column className={style['checkbox-label']}>
                  <Input
                    type='checkbox'
                    name={element.id.toString()}
                    checked={this.isChecked(element.id)}
                    onChange={() => this.handleLocationChange(element.id)}
                    style={{ marginRight: '10px' }} />
                  {element.name}
                </Grid.Column>
              </Grid.Row>
            ))}
            <Grid.Row columns={3}>
              <Grid.Column className={style.label}>
                Value per Ticket:
              </Grid.Column>
              <Grid.Column>
                <Input
                  // type='number' - causes error with comma-delimited nos.
                  name='valuePerTicket'
                  // pattern="[0-9]+?" 
                  size='large'
                  placeholder='0.00'
                  fluid
                  labelPosition='right'
                  value={this.state.valuePerTicket}
                  onKeyDown={numberChecker}
                  onBlur={this.handleOnBlur}
                  onChange={this.handleInputChanges}>
                  <Label basic>$</Label>
                  <input className={style.number} />
                </Input>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Column className={style.label}>
                Quantity of Tickets:
              </Grid.Column>
              <Grid.Column>
                <Input
                  // type='number' - causes error with comma-delimited nos.
                  name='quantityOfTickets'
                  // pattern="[0-9]+?"
                  size='large'
                  placeholder='0'
                  fluid
                  className={style.number}
                  value={this.state.quantityOfTickets}
                  onKeyDown={numberChecker}
                  onBlur={this.handleOnBlur}
                  onChange={this.handleInputChanges} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Column className={style.label}>
                Total Promotion Value:
              </Grid.Column>
              <Grid.Column>
                <Input
                  name='totalPromotionValue'
                  // type='number' - causes error with comma-delimited nos.
                  placeholder='0.00'
                  // pattern="[0-9]+)?" 
                  size='large'
                  labelPosition='right'
                  fluid
                  value={this.state.totalPromotionValue}
                  onKeyDown={numberChecker}
                  onChange={this.handleInputChanges}>
                  <Label basic>$</Label>
                  <input className={style.number} />
                </Input>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Column className={style.label}>
                Starts:
              </Grid.Column>
              <Grid.Column>
                <Grid columns={2}>
                  <Grid.Row>
                    <Grid.Column>
                      <Input type='date' name='dateFrom' size='large' fluid value={this.state.dateFrom} onChange={this.handleInputChanges} />
                    </Grid.Column>
                    <Grid.Column>
                      {/* <Input type="text" name='hoursFrom' placeholder="hh:mm" size='large' fluid value={this.state.hoursFrom} onChange={this.handleInputChanges} /> */}
                      <Grid>
                        <Grid.Row columns={3}>
                          <Grid.Column className={style['dropdown-hhmm']}>
                            <CustomDropdown
                              name='hoursFrom'
                              placeholder='hh'
                              options={hoursOptions}
                              value={this.state.hoursFrom}
                              handleChange={this.handleHoursFromDropdownChange}
                            />
                          </Grid.Column>
                          <Grid.Column className={style['label-colon']}>
                            :
                          </Grid.Column>
                          <Grid.Column className={style['dropdown-hhmm']}>
                            <CustomDropdown
                              name='minutesFrom'
                              placeholder='mm'
                              options={minutesOptions}
                              value={this.state.minutesFrom}
                              handleChange={this.handleMinutesFromDropdownChange}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Column className={style.label}>
                Ends:
              </Grid.Column>
              <Grid.Column>
                <Grid columns={2}>
                  <Grid.Row>
                    <Grid.Column>
                      <Input type='date' name='dateTo' size='large' fluid value={this.state.dateTo} onChange={this.handleInputChanges} />
                    </Grid.Column>
                    <Grid.Column>
                      {/* <Input type="text" name='timeTo' placeholder="hh:mm" size='large' fluid value={this.state.timeTo} onChange={this.handleInputChanges} /> */}
                      <Grid>
                        <Grid.Row columns={3}>
                          <Grid.Column className={style['dropdown-hhmm']}>
                            <CustomDropdown
                              name='hoursTo'
                              placeholder='hh'
                              options={hoursOptions}
                              value={this.state.hoursTo}
                              handleChange={this.handleHoursToDropdownChange}
                            />
                          </Grid.Column>
                          <Grid.Column className={style['label-colon']}>
                            :
                          </Grid.Column>
                          <Grid.Column className={style['dropdown-hhmm']}>
                            <CustomDropdown
                              name='minutesTo'
                              placeholder='mm'
                              options={minutesOptions}
                              value={this.state.minutesTo}
                              handleChange={this.handleMinutesToDropdownChange}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={3}>
              <Grid.Column className={style.label}>
                All-Day:
              </Grid.Column>
              <Grid.Column>
                <input type='checkbox' name='allDay' checked={this.state.allDay} onChange={this.handleInputChanges} style={{ marginRight: '10px' }} />
              </Grid.Column>
            </Grid.Row>
            {/* <Grid.Row columns={3}>
              <Grid.Column className={style.label}>
                Time Zone:
              </Grid.Column>
              <Grid.Column>
                {this.getTimeZonesDropdown()}
              </Grid.Column>
            </Grid.Row> */}
            <Grid.Row columns={3}>
              <Grid.Column className={style.label}>
                Repeat:
              </Grid.Column>
              <Grid.Column>
                {this.getRepeatDropdown()}
              </Grid.Column>
            </Grid.Row>
            {this.state.repeat === 'custom' &&
              <CustomFrequency
                every={this.state.every}
                frequency={this.state.frequency}
                data={[0]} // this.getData()}
                setFrequencyToBeSaved={this.setFrequencyToBeSaved}
                handleFrequencyDropdownChange={this.handleFrequencyDropdownChange}
                handleInputChanges={this.handleInputChanges}
                everyText={this.getEveryText()}
              />
            }
            {/* {this.getFrequencyGridRow()}
            {this.getEveryGridRow()} */}
            <Grid.Row columns={3}>
              <Grid.Column className={style.label}>
                Add Notes:
              </Grid.Column>
              <Grid.Column>
                <Form>
                  <Form.Field
                    control={TextArea}
                    placeholder='Notes'
                    name='notes'
                    value={this.state.notes}
                    onChange={this.handleTextAreaChange}
                    rows='4'
                  />
                </Form>
                {/* <TextArea name="notes" className={style['text-area']} placeholder='Notes' rows={4} value={this.state.notes} onChange={this.handleTextAreaChange} /> */}
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <span className={style.rightContainer}>
            <span className={style['cancel-button']}>
              {this.getCancelButton()}
            </span>
            <span>
              {this.getSaveButton()}
            </span>
          </span>
        </Container>
      </React.Fragment>
    );
  }

  public getCancelButton() {
    return (
      <Button
        defaultMessage={<FormattedMessage id='localization-cancel'
          defaultMessage={this.getCancelButonText()} description='Cancel' />}
        size='huge'
        tabIndex={0}
        customStyle={style['cancel-btn-colors']}
        onClick={this.cancelSavePromo} />
    );
  }

  public getSaveButton() {
    return (
      <Button
        defaultMessage={<FormattedMessage id='localization-add'
          defaultMessage={this.getSaveButtonText()} description='Save' />}
        size='huge'
        tabIndex={0}
        className={style.topbar}
        customStyle={style['default-btn-colors']}
        onClick={this.savePromo} />
    );
  }

  public getTimeZonesDropdown(): JSX.Element {
    const dropdownOptions: DropdownItemProps[] = [
      { key: '1', text: 'Atlantic Time Zone', value: 'atlantic' },
      { key: '2', text: 'Central Time Zone', value: 'central' },
      { key: '3', text: 'Eastern Time Zone', value: 'eastern' },
      { key: '4', text: 'Mountain Time Zone', value: 'mountain' },
      { key: '5', text: 'Newfoundland Time Zone', value: 'newfoundland' },
      { key: '6', text: 'Pacific Time Zone', value: 'pacific' }
    ];

    return (
      <Dropdown
        name='timeZoneDropdown'
        placeholder='Select Time Zone'
        options={dropdownOptions}
        fluid
        selection
        onChange={this.handleTimeZoneDropdownChange}
        className={style.dropdown}
        value={this.state.timeZone}
      />
    );
  }

  public getRepeatDropdown(): JSX.Element {
    const dropdownOptions: DropdownItemProps[] = [
      { key: '1', text: 'None', value: 'none' },
      { key: '2', text: 'Every Day', value: 'daily' },
      { key: '3', text: 'Every Week', value: 'weekly' },
      { key: '4', text: 'Every Month', value: 'monthly' },
      { key: '5', text: 'Every year', value: 'yearly' },
      { key: '6', text: 'Custom', value: 'custom' }
    ];

    return (
      <Dropdown
        name='scheduleRepeatDropdown'
        placeholder='Select Repeat Type'
        options={dropdownOptions}
        fluid
        selection
        onChange={this.handleRepeatDropdownChange}
        className={style.dropdown}
        value={this.state.repeat}
      />
    );
  }

  public getFrequencyDropdown(): JSX.Element {
    const dropdownOptions: DropdownItemProps[] = [
      { key: '1', text: 'Daily', value: 'daily' },
      { key: '2', text: 'Weekly', value: 'weekly' },
      { key: '3', text: 'Monthly', value: 'monthly' },
      { key: '4', text: 'Yearly', value: 'yearly' },
    ];

    return (
      <Dropdown
        name='frequencyDropdown'
        placeholder='Select Frequency'
        options={dropdownOptions}
        fluid
        selection
        onChange={this.handleFrequencyDropdownChange}
        className={style.dropdown}
        value={this.state.frequency}
      />
    );
  }

  public getEveryText(): string {
    const frequency = this.state.frequency;
    let text: string = '';

    if (frequency === 'daily') {
      text = 'day(s)';
    } else if (frequency === 'weekly') {
      text = 'week(s) on:';
    } else if (frequency === 'monthly') {
      text = 'month(s)';
    } else if (frequency === 'yearly') {
      text = 'year(s)';
    }

    return text;
  }

  public render() {
    if (this.props.promoState.pageState === PromotionPageState.ADD) {
      return this.getAddEditPromoView();
    } else if (this.props.promoState.pageState === PromotionPageState.EDIT) {
      return this.getAddEditPromoView();
    } else {
      return this.getPromoListView();
    }
  }

  // Buttons
  public getAddPromoButton(): JSX.Element {
    return (
      <Button
        defaultMessage={<FormattedMessage id='localization-add'
          defaultMessage={this.getAddButtonText()} description='Add' />}
        size='huge'
        tabIndex={0}
        className={style.topbar}
        customStyle={style['default-btn-colors']}
        onClick={this.addPromo} />
    );
  }

  public getEditButton(selectedIndex: string) {
    return (
      <Button
        defaultMessage={<FormattedMessage id='localization-edit' defaultMessage={this.getEditButtonText()} description='Edit' />}
        className='localization-edit'
        size='huge'
        tabIndex={0}
        customStyle={style['default-btn-colors']}
        onClick={() => this.editPromo(selectedIndex)} />
    );
  }

  public getDeleteButton(selectedIndex: string) {
    return (
      <Button
        defaultMessage={<FormattedMessage id='localization-delete'
          defaultMessage={this.getDeleteButtonText()} description='Delete' />}
        size='huge'
        tabIndex={0}
        customStyle={style['default-btn-colors']}
        onClick={() => this.confirmDeletePromo(selectedIndex)} />
    );
  }

  // Texts - In preparation for localization
  public getHeaderText() {
    let header: string = '';
    if (this.props.promoState.list.length > 0) {
      header = 'You Have The Following Promotions Configured';
    } else {
      header = 'You Do Not Have Any Promotions Configured';
    }
    return header;
  }

  public getAddButtonText() {
    return 'Add';
  }

  public getEditButtonText() {
    return 'Edit';
  }

  public getDeleteButtonText() {
    return 'Delete';
  }

  public getSaveButtonText() {
    return 'Save';
  }

  public getCancelButonText() {
    return 'Cancel';
  }
}