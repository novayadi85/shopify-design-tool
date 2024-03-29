import {
    FETCH_PRODUCTS_BEGIN,
    FETCH_PRODUCTS_SUCCESS,
    FETCH_PRODUCTS_FAILURE,
  UPDATE_PAGE,
  UPDATE_LIQUID,
  UPDATE_TEMPLATE_ID
  } from './action';
  
  const initialState = {
    items: [],
    loading: false,
    error: null,
    page: null,
    liquid: null,
    templateId: null,
    templateType: null,
    canAddBlock: true,
    canAddSection: true,
    store: []
  };
  
  export default function productReducer(state = initialState, action) {
    switch(action.type) {
      	case FETCH_PRODUCTS_BEGIN:
			// Mark the state as "loading" so we can show a spinner or something
			// Also, reset any errors. We're starting fresh.
			return {
			...state,
			loading: true,
			error: null
			};
  
        case UPDATE_PAGE:
			// Mark the state as "loading" so we can show a spinner or something
			// Also, reset any errors. We're starting fresh.
			return {
				...state,
				loading: false,
				error: null,
				page: action.payload.page
			};
      
    	case UPDATE_LIQUID:
			// Mark the state as "loading" so we can show a spinner or something
			// Also, reset any errors. We're starting fresh.
			// console.log('action.payload.liquid',action.payload.liquid)
			return {
				...state,
				loading: false,
				error: null,
				liquid: action.payload.liquid
			};
      
        case UPDATE_TEMPLATE_ID:
			// Mark the state as "loading" so we can show a spinner or something
			// Also, reset any errors. We're starting fresh.
			return {
				...state,
				loading: false,
				error: null,
				templateId: action.payload.templateId,
				templateType: action.payload.type,
				canAddBlock: action.payload.canAddBlock,
				canAddSection: action?.payload?.canAddSection,
				store: action.payload.format
        };
      
      	case FETCH_PRODUCTS_SUCCESS:
			// All done: set loading "false".
			// Also, replace the items with the ones from the server
			let items = [action.payload.products];
			return {
				...state,
				loading: false,
				items: items
			};
  
      	case FETCH_PRODUCTS_FAILURE:
			// The request failed. It's done. So set loading to "false".
			// Save the error, so we can display it somewhere.
			// Since it failed, we don't have items to display anymore, so set `items` empty.
			//
			// This is all up to you and your app though:
			// maybe you want to keep the items around!
			// Do whatever seems right for your use case.
			return {
			...state,
			loading: false,
			error: action.payload.error,
			items: []
			};
  
      	default:
        	// ALWAYS have a default case in a reducer
        	return state;
    }
}