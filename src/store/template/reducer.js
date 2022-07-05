import {
	BlockMinor,
	NoteMajor,
	TextAlignmentLeftMajor,
	ProductsMajor,
} from "@shopify/polaris-icons";

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

const initialState = _items;

const templateReducer = (state = initialState, action) => {
    const { type } = action
    switch (type) {
        case 'UPDATE_TEMPLATE':
        return state

        default:
        return state
    }
}

export default templateReducer