import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Query,
    Response,
    Route,
    Security,
    Tags,
    Request, Patch
    } from 'tsoa';
import { inject, ProvideSingleton } from '../ioc';
import { PromotionService, 
    SessionService } from '../services';
import { BaseController } from './BaseController';
import secrets from '../secrets';
import { cookieName, GROUP } from '../constants';
import { LazyServiceIdentifer } from 'inversify';
import { IPromotionResponse } from '../responses';
import { ICreatePromotionRequest } from '../requests';
import { Response as nodeFetchResponse } from 'node-fetch';

@Tags('promotions')
@Route('promotion')
@ProvideSingleton(PromotionController)
export class PromotionController extends BaseController {
  public static readonly siteNumber: string = secrets .app .siteNumber ;

  constructor(
  @inject(new LazyServiceIdentifer(() => PromotionService)) 
  private promotionService: PromotionService
  ) {
    super();
  }

  @Get()
    public async get(): Promise<IPromotionResponse[]> {
      try {
        const promos: IPromotionResponse[] = 
          await this.promotionService .getBySiteNumber(PromotionController.siteNumber);
        return promos;
      } catch (error) {
        console.log(error, 'PromotionController GET Method getAllbySiteNumber');
        return [];
      }   
    }
 
  @Get('{siteNumber}/{campaignNumber}')
    public async getById(siteNumber: string, campaignNumber: string): Promise<IPromotionResponse> {
      try {
        const promo: IPromotionResponse = await this.promotionService.getById(siteNumber, campaignNumber);
        return promo;
      } catch (error) {
        const e: nodeFetchResponse = error;
        this.setStatus(e.status);
        console.log(error, 'PromotionController GET Method getById');
        return null;
      }
    }

  @Post()
  public async create(@Body() body: ICreatePromotionRequest): Promise<IPromotionResponse> {
    try {
        const result = await this.promotionService.save(body);
        if (result == null) {
          this.setStatus(400);
        }
        return result;
    } catch (error) {
        const e: nodeFetchResponse = error;
        this.setStatus(e.status);
        console.log(error, 'PromotionController POST Method create');
        return null;
      }
    }
  
  @Delete('{siteNumber}/{campaignNumber}')
  public async delete(siteNumber: string, campaignNumber: string): Promise<boolean> {
    try {
      const success: boolean = await this.promotionService.delete(siteNumber, campaignNumber);
      if (!success) {
        this.setStatus(400);
      }
      return success;
    } catch (error) {
        const e: nodeFetchResponse = error;
        this.setStatus(e.status);
        console.log(error, 'PromotionController POST Method delete');
        return false;
      }
  }
}