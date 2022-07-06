/*import {
	BlockMinor,
	NoteMajor,
	TextAlignmentLeftMajor,
	ProductsMajor,
} from "@shopify/polaris-icons";

/*
const _items = [
    {
        handle: 'offer-content',
        url: '/#',
        label: 'Offer Content',
        separator: true,
        icon: NoteMajor,
        type: 'section',
    }, {
        handle: 'offer-top',
        url: '/#',
        label: 'Offer top',
        icon: NoteMajor,
        type: 'section',
        items: [
            {
                handle: 'headline',
                url: '/#',
                label: 'headline',
                icon: TextAlignmentLeftMajor,
                type: 'block',
            },
            {
                handle: 'description',
                url: '/#',
                label: 'description',
                icon: TextAlignmentLeftMajor,
                type: 'block',
            }
        ]
    },
    {
        handle: 'offer-product',
        url: '/#',
        label: 'Offer products',
        icon: ProductsMajor,
        type: 'section',
        items: [
            {
                handle: 'save',
                url: '/#',
                label: 'Save',
                icon: TextAlignmentLeftMajor,
                type: 'block',
            },
            {
                handle: 'product-content',
                url: '/#',
                label: 'Product content',
                icon: BlockMinor,
                type: 'block',
            }
        ]
    }
];
*/

const initialState = {
    items: [],
    loading: false,
    error: null
  };

const templateReducer = (state = initialState, action) => {
    const { type } = action
    switch (type) {
        case 'UPDATE_TEMPLATE':
            return {
                ...state,
                loading: false,
                error: null,
                items: action.payload.items
            };
        
        case 'ADD_TEMPLATE':
            // console.log(action.payload.items)
            return {
                ...state,
                loading: false,
                error: null,
                items: [
                    ...state.items,
                    action.payload.items
                ]
            };

        default:
        return state
    }
}

export default templateReducer