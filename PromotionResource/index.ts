import api from '../../lib/api';
import secrets from '../../secrets';
import { ResourceFetch } from '../../types/Api';
import { Promotion, Ticket } from '../../models';

export const baseUrl: string =
  secrets.server.host! + '/promotion';

const { POST, GET, DELETE } = api;

export type GetPromotionListRequestPayload = {
  SiteNumber: string
};

export type GetPromotionListResponsePayload = {
  PromotionList: Ticket.Promotion[];
};

export type GetPromotionRequestPayload = {
  SiteNumber: string,
  CampaignId: string
}

export interface PromotionResource {
    savePromotion: ResourceFetch<Ticket.Promotion, Promotion.ICreatePromotionRequest>;
    getPromotion: ResourceFetch<Ticket.Promotion, GetPromotionRequestPayload>;
    getPromotionList: ResourceFetch<Ticket.Promotion[]>;
    deletePromotion: ResourceFetch<boolean, Pick<Promotion.ICreatePromotionRequest, 'SiteNumber' | 'CampaignId'>>;
    // validateManager: ResourceFetch<Promotion.Model, PartialPick<Promotion.Model, 'username' | 'pin'>>;
  }

export const PromotionResource: PromotionResource = {
    savePromotion: POST(baseUrl, { authenticated: false }),
    getPromotion: GET(`${baseUrl}/:SiteNumber/:CampaignId`, { authenticated: false }),
    getPromotionList: GET(baseUrl, { authenticated: false }),
    deletePromotion: DELETE(`${baseUrl}/:SiteNumber/:CampaignId`, { authenticated: false })
    // validateManager: POST(baseUrl + '/auth/pin', { authenticated: false }),

  }; 