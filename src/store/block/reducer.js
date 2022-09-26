import {
    TextAlignmentLeftMajor,
    ProductsMinor,
    ButtonMinor
} from "@shopify/polaris-icons";
import {
    UPDATE_BLOCKS,
    FETCH_BLOCK_BEGIN,
    FETCH_BLOCK_SUCCESS,
    FETCH_BLOCK_FAILURE
} from './action';
  
let params = new URLSearchParams(window.location.search);
  
const initialState = {
      items: localStorage.getItem('sa-apps') || params.get('sa-apps')  ? [
        {
            handle: 'block-form',
            url: '/#',
            label: 'Form Input',
            icon: TextAlignmentLeftMajor,
            type: 'block',
            helpText: 'Insert form input',
            setting: {}
        },
        {
            handle: 'block-editor',
            url: '/#',
            label: 'Editor',
            icon: TextAlignmentLeftMajor,
            type: 'block',
            helpText: 'Insert Text',
            setting: {}
        },
        ] : [
        {
            handle: 'block-editor',
            url: '/#',
            label: 'Editor',
            icon: TextAlignmentLeftMajor,
            type: 'block',
            helpText: 'Insert Text',
            setting: {}
        },
        {
            handle: 'block-button',
            url: '/#',
            label: 'Button',
            icon: ButtonMinor,
            type: 'block',
            helpText: 'Insert Button type',
            setting: {}
        },
        {
            handle: 'block-form',
            url: '/#',
            label: 'Form Input',
            icon: TextAlignmentLeftMajor,
            type: 'block',
            helpText: 'Insert form input',
            setting: {}
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

        case UPDATE_BLOCKS:
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