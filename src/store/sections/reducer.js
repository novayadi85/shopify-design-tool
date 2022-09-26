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
            handle: 'section',
            url: '/#',
            label: 'Section ',
            separator: true,
            icon: NoteMajor,
            type: 'section',
            helpText: 'Insert new section into content',
            setting: {}
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