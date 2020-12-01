import { Ticket } from 'app/models';

export enum PromotionPageState {
  ADD,
  EDIT,
  READ,
  CANCEL
}

export type PromotionState = {
  list: Ticket.Promotion[];
  pageState: PromotionPageState;
};

export const initialState: PromotionState = {
  list: [],
  //    { id: '1', description: 'Friday Football Night', locations: [0, 5], valuePerTicket: '20.00', quantityOfTickets: '50', totalPromotionValue: '100.00', allDay: false, dateFrom: '2020-07-17', dateTo: '2020-12-17', hoursFrom: '08', minutesFrom: '30', hoursTo: '17', minutesTo: '30', timeZone: 'atlantic', repeat: 'weekly', frequency: '', every: '', day: '', notes: 'This is a weekly event.', weekly: [], monthly: [], yearly: [] },
  //    { id: '2', description: 'Halloween', locations: [1, 4, 5], valuePerTicket: '5.00', quantityOfTickets: '250', totalPromotionValue: '1250.00', allDay: false, dateFrom: '2020-10-31', dateTo: '2020-10-31', hoursFrom: '19', minutesFrom: '00', hoursTo: '23', minutesTo: '59', timeZone: 'eastern', repeat: 'yearly', frequency: '', every: '', day: '', notes: 'Trick or treat', weekly: [], monthly: [], yearly: [] },
  //    { id: '3', description: 'Mother\'s Day', locations: [1, 2], valuePerTicket: '5.00', quantityOfTickets: '10', totalPromotionValue: '50.00', allDay: true, dateFrom: '2020-05-10', dateTo: '2020-05-10', hoursFrom: '', minutesFrom: '', hoursTo: '', minutesTo: '', timeZone: 'eastern', repeat: 'yearly', frequency: '', every: '', day: '', notes: 'This is an annual event.', weekly: [], monthly: [], yearly: [] },
  //    { id: '4', description: 'Quarterly Event', locations: [1, 3], valuePerTicket: '50.00', quantityOfTickets: '500', totalPromotionValue: '25000.00', allDay: false, dateFrom: '2020-09-30', dateTo: '2022-09-30', hoursFrom: '18', minutesFrom: '00', hoursTo: '22', minutesTo: '00', timeZone: 'central', repeat: 'custom', frequency: 'monthly', every: '3', day: '', notes: 'This is a customized promotion that occurs every three months.', weekly: [], monthly: [0, 1, 2], yearly: [] },
  //    { id: '5', description: 'Tuesday Ladies Night', locations: [1, 3, 4, 5], valuePerTicket: '10.00', quantityOfTickets: '20', totalPromotionValue: '200.00', allDay: true, dateFrom: '2020-07-08', dateTo: '2020-11-10', hoursFrom: '', minutesFrom: '', hoursTo: '', minutesTo: '', timeZone: 'pacific', repeat: 'weekly', frequency: '', every: '', day: '', notes: 'This is a weekly event.', weekly: [], monthly: [], yearly: [] }
  // ],
  pageState: PromotionPageState.READ
};
