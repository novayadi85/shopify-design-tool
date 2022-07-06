import {
	NoteMajor,
} from "@shopify/polaris-icons";
import {
    UPDATE_SECTION,
    FETCH_SECTION_BEGIN,
    FETCH_SECTION_SUCCESS,
    FETCH_SECTION_FAILURE
  } from './action';
  
  const initialState = {
    items: [
        {
            handle: 'offer-top',
            url: '/#',
            label: 'Offer top',
            icon: NoteMajor,
            type: 'section',
            helpText: 'Insert headline / description'
        },
        {
            handle: 'offer-product',
            url: '/#',
            label: 'Offer Products',
            icon: NoteMajor,
            type: 'section',
            helpText: 'Insert products section'
        },
        {
            handle: 'offer-footer',
            url: '/#',
            label: 'Offer Footer',
            separator: true,
            icon: NoteMajor,
            type: 'section',
            helpText: ''
        },
    ],
    loading: false,
    error: null
  };
  
export default function sectionReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_SECTION_BEGIN:
        return {
            ...state,
            loading: true,
            error: null
            };
  
        case FETCH_SECTION_SUCCESS:
        return {
            ...state,
            loading: false,
            items: action.payload.items
            };

        case UPDATE_SECTION:
            return {
                ...state,
                loading: false,
                items: action.payload.items
            };
  
        case FETCH_SECTION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                items: []
            };
  
      default:
        return state;
    }
  }