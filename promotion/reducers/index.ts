import { handleActions } from 'redux-actions';
import { PromotionActions } from './../actions';
import { PromotionState, initialState, PromotionPageState } from '../state';
import { Ticket } from 'app/models';
import update from 'immutability-helper';

/* 
* TODO: 
* change the type `any` 
*/ 

type Payload = any & Ticket.Promotion;

export const promotionReducer = handleActions<PromotionState, Payload>(
  {
    [PromotionActions.Type.UPDATE_PROMOTION]: (state, action) => {
      return update(state, {
        list: { $set: action.payload }
      });
    },
    [PromotionActions.Type.ADD_PROMOTION]: (state, action) => {
      return update(state, {
        list: { $set: [action.payload] }
      });
    },
    [PromotionActions.Type.ADD_PROMOTION_REQUEST]: (state, action) => {
      return state;
    },
    [PromotionActions.Type.ADD_PROMOTION_SUCCESS]: (state, action) => {     
      if (action.payload) {    
        const newPromo: Ticket.Promotion = action.payload as Ticket.Promotion;  
        return update(state, {
          list: { $push: [newPromo] },
          pageState: { $set: PromotionPageState.READ }
        });
      }
      return state;
    },
    [PromotionActions.Type.GET_PROMOTION_LIST_REQUEST]: (state, action) => {
      return state;
    },
    [PromotionActions.Type.GET_PROMOTION_LIST_SUCCESS]: (state, action) => {
      if (action.payload) {
        return update(state, {
          list: { $set: action.payload },
          pageState: { $set: PromotionPageState.READ }
        });
      }
      return initialState;
    },
    [PromotionActions.Type.EDIT_PROMOTION_REQUEST]: (state, action) => {
      return state;
    },    
    [PromotionActions.Type.EDIT_PROMOTION_SUCCESS]: (state, action) => {
      const index: number = state.list.map(element => element.id).indexOf(action.payload.id);
      // removed old value, replace it with new value
      return update(state, {
        list: { $splice: [[index, 1, action.payload]] },
        pageState: { $set: PromotionPageState.READ } 
      });
    },
    [PromotionActions.Type.DELETE_PROMOTION_REQUEST]: (state, action) => {
      return state;
    },                                                                                                 
    [PromotionActions.Type.DELETE_PROMOTION_SUCCESS]: (state, action) => {
      if (action.payload) {
        const index: number = state.list.map(element => element.id).indexOf(action.payload.CampaignId);
        return update(state, {
          list: { $splice: [[index, 1]] },
          pageState: { $set: PromotionPageState.READ }
        });
      }
      return state;
    },
    [PromotionActions.Type.DEDUCT_PROMOTION]: (state, action) => {
      return update(state, {
        list: {
          [action.payload.index]: {
            // TODO: Change typings into number
            quantityOfTickets: { $set: (+state.list[action.payload.index].quantityOfTickets - 1).toString() }
          }
        }
      });
    },
    [PromotionActions.Type.PROMOTION_CHANGE_PAGE]: (state, action) => {
      return update(state, {
        pageState: { $set: action.payload.pageState }
      });
    }
  },
  initialState
);
