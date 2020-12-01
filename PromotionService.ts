import { BaseService } from './BaseService';
import {
  get,
  IHttpResponse,
  post,
  put,
  remove
} from '.';
import { ICreatePromotionRequest } from '../requests';
import { IPromotionResponse } from '../responses/index';
import { ProvideSingleton /*, inject */ } from '../ioc';
import secrets from '../secrets';
import * as RequestPromise from 'request-promise';

@ProvideSingleton(PromotionService)
export class PromotionService extends BaseService <IPromotionResponse > {
  public static readonly url: string = secrets.cashdeskWebService.host;
    
  constructor() {
    super();
  }

  public async save(entity: ICreatePromotionRequest): Promise <IPromotionResponse > {
  const method = 'SaveCampaign';
  let xml =
    '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:cd="CashDeskWS">' +
      '<soap:Header/>' +
      '<soap:Body>' +
        '<cd:' + method + '>' +
          '<cd:promo>' +
          '<!--Optional:-->' +
          '<cd:SiteNumber>' + entity.SiteNumber + '</cd:SiteNumber>' +
          '<!--Optional:-->' +
          '<cd:CampaignId>' + entity.CampaignId + '</cd:CampaignId>' +
          '<!--Optional:-->' +
          '<cd:Description>' + entity.Description + '</cd:Description>' +
          '<cd:PlayerSegmentId>' + entity.PlayerSegmentId + '</cd:PlayerSegmentId>' +
          '<!--Optional:-->' +
          '<cd:CouponValue>' + entity.CouponValue + '</cd:CouponValue>' +
          '<!--Optional:-->' +
          '<cd:CouponCount>' + entity.CouponCount + '</cd:CouponCount>' +
          '<!--Optional:-->' +
          '<cd:TotalValue>' + entity.TotalValue + '</cd:TotalValue>' +
          '<cd:StartDate>' + entity.StartDate + '</cd:StartDate>' +
          '<cd:EndDate>' + entity.EndDate + '</cd:EndDate>' +
          '<cd:HoursFrom>' + entity.HoursFrom + '</cd:HoursFrom>' +
          '<cd:MinutesFrom>' + entity.MinutesFrom + '</cd:MinutesFrom>' +
          '<cd:HoursTo>' + entity.HoursTo + '</cd:HoursTo>' +
          '<cd:MinutesTo>' + entity.MinutesTo + '</cd:MinutesTo>' +
          '<cd:Timezone>' + entity.Timezone + '</cd:Timezone>' +
          '<cd:Repeat>' + entity.Repeat + '</cd:Repeat>' +
          '<cd:Frequency>' + entity.Frequency + '</cd:Frequency>' +
          '<cd:Every>' + entity.Every + '</cd:Every>' +
          '<cd:Day>' + entity.Day + '</cd:Day>' +
          '<!--Optional:-->' +
          '<cd:Weekly>';
          entity.Weekly.forEach(week => {
            xml = xml + 
              '<cd:int>' + week + '</cd:int>';
          });
          xml = xml + '</cd:Weekly>' +
          '<!--Optional:-->' +    
          '<cd:Monthly>';
          entity.Monthly.forEach(month => {
            xml = xml + 
              '<cd:int>' + month + '</cd:int>'; 
          });
          xml = xml + '</cd:Monthly>' +
          '<!--Optional:-->' +
          '<cd:Yearly>';
          entity.Yearly.forEach(year => {
            xml = xml + 
              '<cd:int>' + year + '</cd:int>'; 
          });
          xml = xml + '</cd:Yearly>' +
          '<cd:AllDay>' + entity.AllDay + '</cd:AllDay>' +
          '<!--Optional:-->' +
          '<cd:Notes>' + entity.Notes + '</cd:Notes>' +
          '<!--Optional:-->' +
          '<cd:Locations>';
          entity.Locations.forEach(location => {
            xml = xml + '<cd:PromoLocation>' +           
               '<cd:LocationId>' + location.toString().padStart(5, '0') + '</cd:LocationId>' +
               '</cd:PromoLocation>';
          });         
          xml = xml + '</cd:Locations>' +
          '</cd:promo>' +
        '</cd:' + method + '>' +
      '</soap:Body>' +
    '</soap:Envelope>';
  console.log(xml);
  const params = {
    body: xml,
    headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: 'CashDeskWS/' + method
    }
  };
  let response: any = await RequestPromise.post(PromotionService.url, params).catch(console.error);
  console.log('response', response);
  let parsedResponse = await this.parseXml(response);
  let body = parsedResponse ['soap:Envelope']['soap:Body'][0];
  console.log('body', body);
  let value = body.SaveCampaignResponse[0].SaveCampaignResult[0];
    console.log('value', value);
  const promo: IPromotionResponse = {
      id: value.CampaignId[0] = null ? '' : value.CampaignId[0],
      description: value.Description[0] = null ? '' : value.Description[0],
      playerSegmentId: value.PlayerSegmentId[0] = null ? '' : value.PlayerSegmentId[0],
      quantityOfTickets: value.CouponCount[0] = null ? 0 : value.CouponCount[0],
      valuePerTicket: value.CouponValue[0] = null ? 0 : value.CouponValue[0],
      totalPromotionValue: value.TotalValue[0] = null ? 0 : value.TotalValue[0],
      dateFrom: value.StartDate[0] = null ? 0 : value.StartDate[0],
      dateTo: value.EndDate[0] = null ? 0 : value.EndDate[0],
      hoursFrom: value.HoursFrom[0] = null ? 0 : value.HoursFrom[0].toString().padStart(2, '0'),
      hoursTo: value.HoursTo[0] = null ? 0 : value.HoursTo[0].toString().padStart(2, '0'),
      minutesFrom: value.MinutesFrom[0] = null ? 0 : value.MinutesFrom[0].toString().padStart(2, '0'),
      minutesTo: value.MinutesTo[0] = null ? 0 : value.MinutesTo[0].toString().padStart(2, '0'),
      timeZone: value.Timezone[0] = null ? 0 : value.Timezone[0],
      repeat: value.Repeat[0] = null ? 0 : value.Repeat[0],
      frequency: value.Frequency[0] = null ? 0 : value.Frequency[0],
      every: value.Every[0] = null ? 0 : value.Every[0],
      day: value.Day[0] = null ? 0 : value.Day[0],
      weekly: value.Weekly[0] = null ? 0 : value.Weekly[0].int,
      monthly: value.Monthly[0] = null ? 0 : value.Monthly[0].int,
      yearly: value.Yearly[0] = null ? 0 : value.Yearly[0].int,
      allDay: value.AllDay[0] = null ? 0 : value.AllDay[0],
      notes: value.Notes[0] = null ? 0 : value.Notes[0],
      locations: value.Locations[0].PromoLocation.map(loc => {
        return parseInt(loc.LocationId[0], 10);
      })
    };
    console.log('RESPONSE SavePromotion: ', promo);

    return promo;
  }

  public async getBySiteNumber(siteNumber: string): Promise <IPromotionResponse []> {
    const method = 'GetCampaignList';
    const xml =
    '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:cd="CashDeskWS">' +
      '<soap:Header/>' +
      '<soap:Body>' +
        '<cd:' + method + '>' +
        '<!--Optional:-->' +
        '<cd:siteNumber>' + siteNumber + '</cd:siteNumber>' +
        '</cd:' + method + '>' +
      '</soap:Body>' +
    '</soap:Envelope>';
    const params = {
      body: xml,
      headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          SOAPAction: 'CashDeskWS/' + method
      }
    };
    let response: any = await RequestPromise.post(PromotionService.url, params); 
    let parsedResponse = await this.parseXml(response);
    let obj = parsedResponse ['soap:Envelope']['soap:Body'][0];
    let body = obj.GetCampaignListResponse[0].GetCampaignListResult[0];
    let values = body.PromotionDto;
    console.log('values', values);
    let promos: IPromotionResponse [] = [];

    if (values == null) {
      return promos;
    }
    
    values.map((element) => {
      let promo: IPromotionResponse = {
        id: element.CampaignId[0] = null ? '' : element.CampaignId[0],
        description: element.Description[0] = null ? '' : element.Description[0],
        playerSegmentId: element.PlayerSegmentId[0] = null ? '' : element.PlayerSegmentId[0],
        quantityOfTickets: element.CouponCount[0] = null ? 0 : element.CouponCount[0],
        valuePerTicket: element.CouponValue[0] = null ? 0 : element.CouponValue[0],
        totalPromotionValue: element.TotalValue[0] = null ? 0 : element.TotalValue[0],
        dateFrom: element.StartDate[0] = null ? 0 : element.StartDate[0],
        dateTo: element.EndDate[0] = null ? 0 : element.EndDate[0],
        hoursFrom: element.HoursFrom[0] = null ? 0 : element.HoursFrom[0].toString().padStart(2, '0'),
        hoursTo: element.HoursTo[0] = null ? 0 : element.HoursTo[0].toString().padStart(2, '0'),
        minutesFrom: element.MinutesFrom[0] = null ? 0 : element.MinutesFrom[0].toString().padStart(2, '0'),
        minutesTo: element.MinutesTo[0] = null ? 0 : element.MinutesTo[0].toString().padStart(2, '0'),
        timeZone: element.Timezone[0] = null ? 0 : element.Timezone[0],
        repeat: element.Repeat[0] = null ? 0 : element.Repeat[0],
        frequency: element.Frequency[0] = null ? 0 : element.Frequency[0],
        every: element.Every[0] = null ? 0 : element.Every[0],
        day: element.Day[0] = null ? 0 : element.Day[0],
        weekly: element.Weekly[0] = null ? 0 : element.Weekly[0].int,
        monthly: element.Monthly[0] = null ? 0 : element.Monthly[0].int,
        yearly: element.Yearly[0] = null ? 0 : element.Yearly[0].int,
        allDay: element.AllDay[0] = null ? 0 : element.AllDay[0],
        notes: element.Notes[0] = null ? 0 : element.Notes[0],
        locations: element.Locations[0].PromoLocation.map(loc => {
          return parseInt(loc.LocationId[0], 10);
        })
      };  
      console.log('RESPONSE GetPromotion: ', promo);

      promos.push(promo);
    });

    return promos;
  }

  public async getById(siteNumber: string, noCampaign: string): Promise <IPromotionResponse > {
    const method = 'GetCampaign';
    const xml =
      '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:cd="CashDeskWS">' +
        '<soap:Header/>' +
        '<soap:Body>' +
          '<cd:' + method + '>' +
          '<!--Optional:-->' +
          '<cd:siteNumber>' + siteNumber + '</cd:siteNumber>' +
          '<cd:campaignId>' + noCampaign + '</cd:campaignId>' +
          '</cd:' + method + '>' +
        '</soap:Body>' +
      '</soap:Envelope>';
    const params = {
      body: xml,
      headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          SOAPAction: 'CashDeskWS/' + method
      }
    };
    let response: any = await RequestPromise.post(PromotionService.url, params);
    let parsedResponse = await this.parseXml(response);
    const body = parsedResponse ['soap:Envelope']['soap:Body'][0];
    const value = body.GetCampaignResponse[0].GetCampaignResult[0];
    console.log('VALUE: ', value);
    const promo: IPromotionResponse = {
      id: value.CampaignId[0] = null ? '' : value.CampaignId[0],
      description: value.Description[0] = null ? '' : value.Description[0],
      playerSegmentId: value.PlayerSegmentId[0] = null ? '' : value.PlayerSegmentId[0],
      quantityOfTickets: value.CouponCount[0] = null ? 0 : value.CouponCount[0],
      valuePerTicket: value.CouponValue[0] = null ? 0 : value.CouponValue[0],
      totalPromotionValue: value.TotalValue[0] = null ? 0 : value.TotalValue[0],
      dateFrom: value.StartDate[0] = null ? 0 : value.StartDate[0],
      dateTo: value.EndDate[0] = null ? 0 : value.EndDate[0],
      hoursFrom: value.HoursFrom[0] = null ? 0 : value.HoursFrom[0].toString().padStart(2, '0'),
      hoursTo: value.HoursTo[0] = null ? 0 : value.HoursTo[0].toString().padStart(2, '0'),
      minutesFrom: value.MinutesFrom[0] = null ? 0 : value.MinutesFrom[0].toString().padStart(2, '0'),
      minutesTo: value.MinutesTo[0] = null ? 0 : value.MinutesTo[0].toString().padStart(2, '0'),
      timeZone: value.Timezone[0] = null ? 0 : value.Timezone[0],
      repeat: value.Repeat[0] = null ? 0 : value.Repeat[0],
      frequency: value.Frequency[0] = null ? 0 : value.Frequency[0],
      every: value.Every[0] = null ? 0 : value.Every[0],
      day: value.Day[0] = null ? 0 : value.Day[0],
      weekly: value.Weekly[0] = null ? 0 : value.Weekly[0].int,
      monthly: value.Monthly[0] = null ? 0 : value.Monthly[0].int,
      yearly: value.Yearly[0] = null ? 0 : value.Yearly[0].int,
      allDay: value.AllDay[0] = null ? 0 : value.AllDay[0],
      notes: value.Notes[0] = null ? 0 : value.Notes[0],
      locations: value.Locations[0].PromoLocation.map(loc => {
        return parseInt(loc.LocationId[0], 10);
      })
    };
    console.log('RESPONSE GetPromotion: ', promo);

    return promo;
  }

  public async delete(siteNumber: string, noCampaign: string): Promise <boolean> {
    const method = 'DeleteCampaign';
    const xml =
      '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:cd="CashDeskWS">' +
        '<soap:Header/>' +
        '<soap:Body>' +
          '<cd:' + method + '>' +
          '<!--Optional:-->' +
          '<cd:siteNumber>' + siteNumber + '</cd:siteNumber>' +
          '<cd:campaignId>' + noCampaign + '</cd:campaignId>' +
          '</cd:' + method + '>' +
        '</soap:Body>' +
      '</soap:Envelope>';
    const params = {
      body: xml,
      headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          SOAPAction: 'CashDeskWS/' + method
      }
    };
    let response: any = await RequestPromise.post(PromotionService.url, params);
    let parsedResponse = await this.parseXml(response);
    const body = parsedResponse ['soap:Envelope']['soap:Body'][0];
    const value = body.DeleteCampaignResponse[0].DeleteCampaignResult[0];
    console.log('value', value);
    return value;
  }

  private parseXml(xml: string): any {
    const parseString = require('xml2js').parseString;

    return new Promise((resolve, reject) => {
        parseString(xml, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
  }
}