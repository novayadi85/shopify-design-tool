import {
    TextAlignmentLeftMajor,
    ProductsMinor
} from "@shopify/polaris-icons";
import {
    UPDATE_BLOCK,
    FETCH_BLOCK_BEGIN,
    FETCH_BLOCK_SUCCESS,
    FETCH_BLOCK_FAILURE
  } from './action';
  
  const initialState = {
    items: [
        {
            handle: 'block-editor',
            url: '/#',
            label: 'Editor',
            icon: TextAlignmentLeftMajor,
            type: 'block',
            helpText: 'Insert Text'
        },
        {
            handle: 'block-content',
            url: '/#',
            label: 'Content',
            icon: TextAlignmentLeftMajor,
            type: 'block',
            helpText: 'Insert content type'
        },
        {
            handle: 'block-product',
            url: '/#',
            label: 'Products',
            icon: ProductsMinor,
            type: 'block',
            helpText: 'Insert product type'
        },
    ],
    loading: false,
    error: null
  };
  
export default function sectionReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_BLOCK_BEGIN:
        return {
            ...state,
            loading: true,
            error: null
            };
  
        case FETCH_BLOCK_SUCCESS:
        return {
            ...state,
            loading: false,
            items: action.payload.items
            };

        case UPDATE_BLOCK:
            return {
                ...state,
                loading: false,
                items: action.payload.items
            };
  
        case FETCH_BLOCK_FAILURE:
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