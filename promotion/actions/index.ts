import * as _ from 'lodash';
import { createAction } from 'redux-actions';
import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Promotion, Ticket } from 'app/models';
import { PromotionResource } from 'app/services';
import { Error } from 'app/constants';

/* 
* TODO: 
* change the type `any` 
*/

type Thunk = ThunkAction<Promise<void>, {}, {}, AnyAction>;
export type deletePromotionPayload = Pick<Promotion.ICreatePromotionRequest, 'SiteNumber' | 'CampaignId'>;

export namespace PromotionActions {
  export enum Type {
    ADD_PROMOTION = 'ADD_PROMOTION',
    ADD_PROMOTION_REQUEST = 'ADD_PROMOTION_REQUEST',
    ADD_PROMOTION_SUCCESS = 'ADD_PROMOTION_SUCCESS',
    ADD_PROMOTION_FAILURE = 'ADD_PROMOTION_FAILURE',

    GET_PROMOTION_LIST_REQUEST = 'GET_PROMOTION_LIST_REQUEST',
    GET_PROMOTION_LIST_SUCCESS = 'GET_PROMOTION_LIST_SUCCESS',
    GET_PROMOTION_LIST_FAILURE = 'GET_PROMOTION_LIST_FAILURE',

    EDIT_PROMOTION = 'EDIT_PROMOTION',
    EDIT_PROMOTION_REQUEST = 'EDIT_PROMOTION_REQUEST',
    EDIT_PROMOTION_SUCCESS = 'EDIT_PROMOTION_SUCCESS',
    EDIT_PROMOTION_FAILURE = 'EDIT_PROMOTION_FAILURE',

    DELETE_PROMOTION = 'DELETE_PROMOTION',
    DELETE_PROMOTION_REQUEST = 'DELETE_PROMOTION_REQUEST',
    DELETE_PROMOTION_SUCCESS = 'DELETE_PROMOTION_SUCCESS',
    DELETE_PROMOTION_FAILURE = 'DELETE_PROMOTION_FAILURE',

    UPDATE_PROMOTION = 'UPDATE_PROMOTION',
    DEDUCT_PROMOTION = 'DEDUCT_PROMOTION',

    PROMOTION_CHANGE_PAGE = 'PROMOTION_CHANGE_PAGE'
  }

  export const updatePromotion = createAction<any>(Type.UPDATE_PROMOTION);
  //export const editPromotion = createAction<any>(Type.EDIT_PROMOTION);
  //export const deletePromotion = createAction<any>(Type.DELETE_PROMOTION);
  export const deductPromotion = createAction<any>(Type.DEDUCT_PROMOTION);

  export const addPromotion = (promotion: Promotion.ICreatePromotionRequest): Thunk => {
    const request = createAction<Promotion.ICreatePromotionRequest>(Type.ADD_PROMOTION_REQUEST);
    const success = createAction<Ticket.Promotion>(Type.ADD_PROMOTION_SUCCESS);
    const failure = createAction<Error>(Type.ADD_PROMOTION_FAILURE);

    return (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
      dispatch(request(promotion));

      return PromotionResource.savePromotion(promotion).then(
        (validPromotion: Ticket.Promotion) => {
          dispatch(success(validPromotion));
        },
        (error: Error) => {
          dispatch(failure(error));
        }
      );
    };
  };

  export const getPromotionList = (): Thunk => {
    const request = createAction(Type.GET_PROMOTION_LIST_REQUEST);
    const success = createAction<Ticket.Promotion[]>(Type.GET_PROMOTION_LIST_SUCCESS);
    const failure = createAction<Error>(Type.GET_PROMOTION_LIST_FAILURE);

    return (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
      dispatch(request());

      return PromotionResource.getPromotionList().then(
        (response: Ticket.Promotion[]) => {
          dispatch(success(response));
        },
        (error: Error) => {
          dispatch(failure(error));
        }
      );
    };
  };

  export const editPromotion = (promotion: Promotion.ICreatePromotionRequest): Thunk => {
    const request = createAction<Promotion.ICreatePromotionRequest>(Type.EDIT_PROMOTION_REQUEST);
    const success = createAction<Ticket.Promotion>(Type.EDIT_PROMOTION_SUCCESS);
    const failure = createAction<Error>(Type.EDIT_PROMOTION_FAILURE);

    return (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
      dispatch(request(promotion));

      return PromotionResource.savePromotion(promotion).then(
        (responsePayload: Ticket.Promotion) => {
          dispatch(success(responsePayload));
        },
        (error: Error) => {
          dispatch(failure(error));
        }
      );
    };
  };

  export const deletePromotion = (payload: deletePromotionPayload): Thunk => {
    const request = createAction<deletePromotionPayload>(Type.DELETE_PROMOTION_REQUEST);
    const success = createAction<deletePromotionPayload>(Type.DELETE_PROMOTION_SUCCESS);
    const failure = createAction<Error>(Type.DELETE_PROMOTION_FAILURE);

    return (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
      dispatch(request(payload));

      return PromotionResource.deletePromotion(payload).then(
        () => {
          dispatch(success(payload));
        },
        (error: Error) => {
          dispatch(failure(error));
        }
      );
    };
  };

  export const changePage = createAction(Type.PROMOTION_CHANGE_PAGE);
}

export type PromotionActions = Omit<typeof PromotionActions, 'Type'>;
