export interface IPromotionLocationResponse {
    id: string;
    locationId: string;
  }

export interface IPromotionResponse {
    id: string;
    description: string;
    playerSegmentId: string;
    valuePerTicket: string;
    quantityOfTickets: string;
    totalPromotionValue: string;
    dateFrom: string;
    dateTo: string;
    hoursFrom: string;
    hoursTo: string;
    minutesFrom: string;
    minutesTo: string;
    timeZone: string;
    repeat: string;
    frequency: string;
    every: string;
    day: string;
    weekly: number[];
    monthly: number[];
    yearly: number[];
    allDay: boolean;
    notes: string;
    locations: number[];
  }